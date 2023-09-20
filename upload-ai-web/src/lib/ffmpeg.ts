import { FFmpeg } from "@ffmpeg/ffmpeg"

let ffmpeg: FFmpeg | null // ou null > pois precisamos carregar a biblioteca no momento que formos utilizar ela. Assim, enquanto ela não carregar terá a variável terá o valor null

export async function getFFmpeg() {
	if (ffmpeg) {
		return ffmpeg
	}

	ffmpeg = new FFmpeg()

	if (!ffmpeg.loaded) {
		await ffmpeg.load()
	}

	return ffmpeg
}