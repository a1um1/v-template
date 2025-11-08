import Elysia from "elysia"

const ApiRoute = new Elysia<''>({
	prefix: ''
}).get('/', async ()=>{
	return 'Hello from API route'
})

export default ApiRoute