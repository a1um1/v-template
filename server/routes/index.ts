import ProductApiRoute from "@server/routes/products"
import Elysia from "elysia"

const ApiRoute = new Elysia<''>({
	prefix: ''
}).get('/', async ()=>{
	return 'Hello from API route'
})
.use(ProductApiRoute)
export default ApiRoute