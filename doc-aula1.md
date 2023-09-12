# Iniciando o Projeto

Incializando nosso projeto NLW-IA que será separado em web (front), server(back + db) e mobile(front).

## Layout Web/React

Passo a passo da criação do layout Web utilizando REACT.

- Atualizando o Node
	- versão v18.17.1
- Iniciando um projeto React com Vite (boilerplate). 2 formas:
	> npm create vite@latest ou pnpm create vite

		PNPM: Age da mesma forma que o `npm` porém consome menos espaço no seu pc ao instalar uma dependencia. Instalando `pnpm`: 
		- npm i -g pnpm
	- nome do projeto: "upload-ai-web"
	- opções Vite project: React e Typescript
- Instalando dependências do projeto
	- Vamos até o projeto:  "cd upload-ai-web/"
	> npm i ou pnpm i
- Limpando estrurura padrão do Vite
	- README.md(deletar)
	- .eslintrc.cjs(deletar)
	- index.html
		- trocamos o título: "upload.ia
		- removemos tag <link> com o favicon
	- /src
		- \assets(deletar)
		- App.css(deletar)
		- APP.tsx
			- importações + elementos html dentro de return (remover)
			- <h1>Hello World<h1> (add)
			- export default para export function App (update)
		- index.css (remover conteúdo)
	- /public
		- vite.svg (deletar)
- Inicializando GIT 
	- git init
	- Primeiro commit
	- git commit -m "inicial commit"
- Rodando o projeto.
	> npm run dev ou pnpm run dev
- Instalando e configurando os frameworks do projeto
	- Tailwind-CSS (com as depencias postcss e autoprefixer)
		```
		- npm:
			> npm install -D tailwindcss postcss autoprefixer
			> npx tailwindcss init -p
		- pnpm
			> pnpm add -D tailwindcss postcss autoprefixer
			> npx tailwindcss init -p
		```
	- Editando tsconfig.json (key: compileroptions)
		- Importamos arquivos de qualquer lugar da aplicação utilizando @ evitand pths longs como '../../filename.ts'
		- Interpreta todos arquivos importados com "@/filename.ts" como sendo originárips da pasta "./src"
		```
		/* Paths */
		"baseUrl": ".",
		"paths": {
			"@/*": ["./src/*"]
		}
		```
	- Instalando types/nodes
		- Biblioteca que permite fazer importações das APIs internas no node, como por exemplo importar o 'path' sem erro
		> npm i -D @types/node 
	- Editando vite.config.ts
		- Add as configurações do Vite nosso path "@/" para que ele possa compreender essa extenção
		```
		import path from "path"
		import react from "@vitejs/plugin-react"
		import { defineConfig } from "vite"

		export default defineConfig({
			plugins: [react()],
			resolve: {
				alias: {
				"@": path.resolve(__dirname, "./src"),
				},
			},
		})
		```
	- Inicializando Shadcn/ui 
		- biblioteca que traz os componentes do `Radix-ui` já estilizados utilizando Tailwindcss seguindo um estilo padrão entre eles
			- Radix-ui: biblioteca que traz estrura de componentes (sem estilização) prontos de aplicação web já criados e permite estilização.
		- utilizaremos a estilização do componente "playground" em nossa aplicação
		- Traz já automaticamente o passo a passo de intalação dos frameworks Tailwind-CSS e radix-ui na documentação de sua instalação
		- https://ui.shadcn.com/
		> npx shadcn-ui@latest init ou pnpm dlx shadcn-ui@latest init
		- opções shadcn/ui: 
		```
			Would you like to use TypeScript (recommended)?yes
			Which style would you like to use? › New York
			Which color would you like to use as base color? › Zinc
			Where is your global CSS file? › › src/index.css
			Do you want to use CSS variables for colors? › yes
			Where is your tailwind.config.js located? › tailwind.config.js
			Configure the import alias for components: › @/components
			Configure the import alias for utils: › @/lib/utils
			Are you using React Server Components? › no
		```
- Adicionadp componentes shadcn-ui
	- Componentes são intalados via CLI
	- Componentes são adicionados na pasta "src/components" criada
	```
		// ex: add button: 
		- npm:
			> npx shadcn-ui@latest add button
		- pnpm
			> pnpm dlx shadcn-ui@latest add button
	```
	- Após criado, podemos importar para nosso `App.tsx` o componente criado

	```
		import { Button } from "./components/ui/button";

		export function App() {
			return (
				<Button>Teste</Button>
			)
		}
	```