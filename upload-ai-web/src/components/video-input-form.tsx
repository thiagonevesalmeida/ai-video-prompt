import { FileVideo, Upload} from 'lucide-react';
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea} from "./ui/textarea";
import { Label } from "./ui/label";
import { ChangeEvent, FormEvent, useState, useMemo, useRef} from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

interface VideoInputFormProps {
	onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
	const [videoFile, setVideoFile] = useState<File | null>(null)
	const [status, setStatus] = useState<Status>('waiting')

	const promptInputRef = useRef<HTMLTextAreaElement>(null)
	
	function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
		const { files } = event.currentTarget

		if (!files) {
			return
		}

		const selectedFile = files[0] // file presente no input "type: files" é sempre um array, pois pode permitir o input de múltiplos arquivos caso insira o atributo "multiples". Como desejamos apenas o primeiro = files[0]

		setVideoFile(selectedFile)
	}

	async function convertVideoToAudio(video: File) {
		console.log('Convert started.')

		const ffmpeg = await getFFmpeg()
		await ffmpeg.writeFile('input.mp4', await fetchFile(video))

		// Em caso de erro, retirar comentário para verificar o print do erro
		// ffmpeg.on('log', log => {
		// 	console.log(log)
		// })

		ffmpeg.on('progress', progress => {
			console.log('Convert progress: ' + Math.round(progress.progress * 100))
		})

		await ffmpeg.exec([
			'-i',
			'input.mp4',
			'-map',
			'0:a',
			'-b:a',
			'20k',
			'-acodec',
			'libmp3lame',
			'output.mp3'
		])

		const data = await ffmpeg.readFile('output.mp3')
		const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
		const audioFile = new File([audioFileBlob], 'audio.mp3', {
			type: 'audio/mpeg',
		})

		console.log('Convert finished.')
		return audioFile

	}

	async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const prompt = promptInputRef.current?.value

		if(!videoFile) {
			return
		}

		// convert video to audio
		setStatus('converting')
		const audioFile = await convertVideoToAudio(videoFile) 
		
		// upload audio to backend
		const data = new FormData()
		data.append('file', audioFile)

		setStatus('uploading')

		const response = await api.post('/videos', data)
		const videoId = response.data.video.id

		// generate video transcription
		setStatus('generating')
		await api.post(`videos/${videoId}/transcription`, {
			prompt,
		})

		setStatus('success')

		props.onVideoUploaded(videoId)
	}

	const previewURL = useMemo(() => {
		if (!videoFile) {
			return null
		}

		return URL.createObjectURL(videoFile) //URL.createObjectURL() - Cria um objeto URl de pré-visualização de um arquivo (imagem,video,texto..)

	}, [videoFile]) //previewURL só será alterada/atualizada quando videoFile for alterado

	return(
		<form onSubmit={handleUploadVideo} className="space-y-6">
			<label 
				htmlFor="video"
				className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
			>
				{previewURL ? (
          <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
        ) : (
					<>
						<FileVideo className="w-4 h-4" />
						Selecione um vídeo
					</>
				)}
			</label>

			<input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected} />

			<Separator />

			<div className="space-y-2">
				<Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
				<Textarea 
					ref={promptInputRef}
					disabled={status !== 'waiting'}
					id="transcription_prompt" 
					className="h-20 leading-relaxed resize-none"
					placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
				/>
			</div>

			<Button
				data-success={status === 'success'}
				disabled={status !== 'waiting'} 
				type="submit" 
				className="w-full data-[success=true]:bg-emerald-400"
			>
				{status === 'waiting' ? 
					(
						<>
						Carregar Vídeo
						<Upload className="w-4 h-4 ml-2"/>
						</>
					) : `${status}...`
				}
			</Button>
		</form>
	)
}