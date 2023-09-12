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
