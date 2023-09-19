import { FileVideo, Upload} from 'lucide-react';
import { Button } from "./button";
import { Separator } from "./separator";
import { Textarea} from "./textarea";
import { Label } from "./label";

export function VideoInputForm() {
	function handleFileSelected(event) {

	}

	return(
		<form className="space-y-6">
			<label 
				htmlFor="video"
				className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
			>
				<FileVideo className="w-4 h-4" />
				Selecione um vídeo
			</label>
			<input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected} />

			<Separator />

			<div className="space-y-2">
				<Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
				<Textarea 
					id="transcription_prompt" 
					className="h-20 leading-relaxed resize-none"
					placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
				/>
			</div>

			<Button type="submit" className="w-full">
				Carregar vídeo
				<Upload className="w-4 h-4 ml-2"/>
			</Button>
		</form>
	)
}