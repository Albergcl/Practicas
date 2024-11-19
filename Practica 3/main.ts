/*

DESCRIPCION:
  - Crear una nueva tarea.
  - Listar todas las tareas existentes.
  - Buscar una tarea por su ID (generado por Mongo).
  - Actualizar el estado de una tarea (completada o pendiente).
  - Eliminar una tarea.
REQUISITOS:
  - Utilizar los métodos HTTP: GET, POST, PUT y DELETE.
  - Manejar rutas de manera que cada funcionalidad tenga una ruta específica.
  - Validar que los datos enviados por el cliente sean correctos.
  - Manejar errores, como tareas no encontradas o datos incompletos.
  - Los datos deben almacenarse en MongoDB

Rutas de la API
1. Obtener todas las tareas
  Método: GET
  Ruta: /tasks
  Descripción: Devuelve una lista de todas las tareas.

2. Obtener una tarea por ID
  Método: GET
  Ruta: /tasks/:id
  Descripción: Devuelve los detalles de una tarea específica.
  Errores posibles:
    Si no existe una tarea con ese ID, devolver: { "error": "Tarea no encontrada" }

  3. Crear una nueva tarea
  Método: POST
  Ruta: /tasks
  Descripción: Crea una nueva tarea con el título enviado en el cuerpo de la petición. Por defecto, la tarea estará marcada como "pendiente".

  4. Actualizar el estado de una tarea
  Método: PUT
  Ruta: /tasks/:id
  Descripción: Actualiza el estado de una tarea (de pendiente a completada o viceversa).

  5. Eliminar una tarea
  Método: DELETE
  Ruta: /tasks/:id
  Descripción: Elimina una tarea por su ID.
  Errores posibles:
    Si no existe una tarea con ese ID, devolver: { "error": "Tarea no encontrada" }

*/

//Gonzalo Vazquez Segura y Alberto Gonzalez-Calero Lopez

import { MongoClient, ObjectId } from "mongodb";
import type { TaskModel } from "./types.ts";
import { fromModelToTask } from "./utils.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL){
  console.log("Debes crear la variable de entorno MONGO_MONGO_URL");
  Deno.exit(1);
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Conectado a la base de datos");

const db = client.db("TareasDB");

const TasksCollection = db.collection<TaskModel>("tasks");

const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if(method === "GET"){
    if(path === "/tasks"){
      const tasksDB = await TasksCollection.find().toArray();
      const tasks = await Promise.all(tasksDB.map((t) => fromModelToTask(t)));
      return new Response(JSON.stringify(tasks), { status: 200 });

    } else if(path.startsWith("/tasks/")){
        const idPath = path.split("/")[2];

        const taskDB = await TasksCollection.findOne({ _id: new ObjectId(idPath) });
        if (!taskDB) return new Response("Task not found", { status: 404 });
        const task = fromModelToTask(taskDB);
        return new Response(JSON.stringify(task), { status: 200 }); 
    }


  }else if(method === "POST"){
    if(path === "/tasks"){
      const task = await req.json();
      if(!task.title){
        return new Response("Bad request", { status: 400 });
      }

      const taskDB = await TasksCollection.findOne({ title: task.title });
      if(taskDB) return new Response("Task already exists", { status: 409 });

      const { insertedId } = await TasksCollection.insertOne({
        title: task.title,
        completed: false
      });

      return new Response(JSON.stringify({
        title: task.title,
        completed: false,
        id: insertedId
      }), { status: 201 });
    }


  }else if(method === "PUT"){
    if(path.startsWith("/tasks/")){
      const task = await req.json();
      const idPath = path.split("/")[2];

      const { modifiedCount } = await TasksCollection.updateOne(
        { _id: new ObjectId(idPath) },
        { $set: { completed: task.completed } }
      );

      if(modifiedCount === 0){
        return new Response("Task not found", { status: 404 });
      }

      const taskDB = await TasksCollection.findOne({ _id: new ObjectId(idPath) });
      if(!taskDB) return new Response("Task not found", { status: 404 });

      return new Response(JSON.stringify({
        id: taskDB._id,
        title: taskDB.title,
        completed: taskDB.completed,
      }), { status: 200 });
    }


  }else if(method === "DELETE"){
    if(path.startsWith("/tasks/")){
      const idPath = path.split("/")[2];

      if(!idPath) return new Response("Bad request", { status: 400 });
      const { deletedCount } = await TasksCollection.deleteOne({
        _id: new ObjectId(idPath)
      });

      if(deletedCount === 0){
        return new Response("Task not found", { status: 404 });
      }

      return new Response("Tarea eliminada correctamente", { status: 200 });
    }
  }

  return new Response("Endpoint not found", { status: 404 });
}

Deno.serve({ port: 3000, handler });