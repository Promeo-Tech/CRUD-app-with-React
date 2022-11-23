import { createServer, Model} from "miragejs"


createServer({
  models: {
    car: Model
  }, 
  seeds(server) {  // prefix api data / you do as much data as you want / this is the prefixed data
    server.create("car", { name: "Ford", model: "Mustang", year: 2010})
    server.create("car", { name: "Toyota", model: "Rav-4", year: 2014})
    server.create("car", { name: "Nissan", model: "350z", year: 2017})
  },
  routes() {
    this.namespace = "api" // this will serve as my api
    this.get("/cars", (schema) => {
      return schema.cars.all() // this will return all the cars in the api server 
    })
    
    this.get("/cars/:id", (schema, request) => {
      let id = request.params.id
    
      return schema.cars.find(id)
    })
    
    this.post("/cars", (schema, request) => {
      let attrs = JSON.parse(request.requestBody)
    
      return schema.cars.create(attrs)  // this is how I will add new cars to the api data
    })
    
    this.patch("/cars/:id", (schema, request) => {   // this is the update
      let newAttrs = JSON.parse(request.requestBody)
      let id = request.params.id
      let car = schema.cars.find(id)
    
      return car.update(newAttrs)  
    })
    
    this.delete("/cars/:id", (schema, request) => {
      let id = request.params.id
    
      return schema.cars.find(id).destroy() // this will be my delete car
    })
  },
})