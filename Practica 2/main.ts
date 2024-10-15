/*
  Ruta 1: /productos
    Esta ruta debe devolver la lista de todos los productos. Además, puede aceptar parámetros para filtrar los productos por precio.
    Descripción: Devuelve todos los productos. Permite filtrar por un rango de precios usando SearchParams.
    Query Params opcionales:
    minPrecio (devuelve productos cuyo precio sea mayor o igual al valor proporcionado).
    maxPrecio (devuelve productos cuyo precio sea menor o igual al valor proporcionado).

    Ejemplo de uso:
    /productos → Devuelve todos los productos.
    /productos?minPrecio=20 → Devuelve todos los productos con precio mayor o igual a 20.
    /productos?maxPrecio=50 → Devuelve todos los productos con precio menor o igual a 50.
    /productos?minPrecio=20&maxPrecio=50 → Devuelve todos los productos cuyo precio esté entre 20 y 50.

Ruta 2: /producto/:id
    Esta ruta permite obtener la información de un producto específico usando el id del producto como parámetro en la URL.
    Descripción: Devuelve los detalles de un producto a partir de su id.
    Parámetro URL: id (el identificador del producto).
    Ejemplo de uso:
    /producto/1 → Devuelve la información del producto con id 1.
    /producto/3 → Devuelve la información del producto con id 3.


    Notas adicionales:
    Si no existe un producto con el id especificado, devolver un mensaje de error: "Producto no encontrado".

Ruta 3: /calcular-promedio
    Esta ruta debe calcular el precio promedio de todos los productos. También puede aceptar un parámetro opcional para calcular el promedio solo de productos dentro de un rango de precios.
    Descripción: Calcula el precio promedio de los productos. Permite calcular el promedio solo para productos dentro de un rango de precios usando los Query Params minPrecio y maxPrecio.
    Query Params opcionales:
    minPrecio (filtra productos con precio mayor o igual al valor proporcionado).
    maxPrecio (filtra productos con precio menor o igual al valor proporcionado).


    Ejemplo de uso:
    /calcular-promedio → Calcula el precio promedio de todos los productos.
    /calcular-promedio?minPrecio=20 → Calcula el precio promedio de los productos cuyo precio es mayor o igual a 20.
    /calcular-promedio?maxPrecio=50 → Calcula el precio promedio de los productos cuyo precio es menor o igual a 50.
    /calcular-promedio?minPrecio=20&maxPrecio=50 → Calcula el promedio de productos con precios entre 20 y 50.
*/

//Gonzalo Vazquez Segura y Alberto Gonzalez-Calero Lopez

const productos = [
  { id: 1, nombre: 'Producto A', precio: 30 },
  { id: 2, nombre: 'Producto B', precio: 20 },
  { id: 3, nombre: 'Producto C', precio: 50 },
  { id: 4, nombre: 'Producto D', precio: 10 }
];

const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;
  const searchParams = url.searchParams;

  const minPrecio = searchParams.get("minPrecio");
  const maxPrecio = searchParams.get("maxPrecio");

  if(method === "GET"){
    if(path === "/productos"){
      if(minPrecio && maxPrecio){
        const prodFiltrados = productos.filter(elem => elem.precio >= Number(minPrecio) && elem.precio <= Number(maxPrecio));
        return new Response(JSON.stringify(prodFiltrados), {status: 200});

      }else if(minPrecio){
        const prodFiltrados = productos.filter(elem => elem.precio >= Number(minPrecio));
        return new Response(JSON.stringify(prodFiltrados), {status: 200});
        
      }else if(maxPrecio){
        const prodFiltrados = productos.filter(elem => elem.precio <= Number(maxPrecio));
        return new Response(JSON.stringify(prodFiltrados), {status: 200});
      }

      return new Response(JSON.stringify(productos), {status: 200});

    }else if(path.startsWith("/producto/")){
      const idPath = path.split("/")[2];
      const idProd = Number(idPath);

      const producto = productos.find(elem => elem.id === idProd);

      if(!producto){
        return new Response("Product not find", {status: 404});
      }else{
        return new Response(JSON.stringify(producto));
      }
    
    }else if(path === "/calcular-promedio"){
      if(minPrecio && maxPrecio){
        const prodFiltrados = productos.filter(elem => elem.precio >= Number(minPrecio) && elem.precio <= Number(maxPrecio));
        const promedio = prodFiltrados.reduce((acc, elem) => acc + elem.precio, 0) / prodFiltrados.length;
        return new Response(JSON.stringify(promedio), {status: 200});

      }else if(minPrecio){
        const prodFiltrados = productos.filter(elem => elem.precio >= Number(minPrecio));
        const promedio = prodFiltrados.reduce((acc, elem) => acc + elem.precio, 0) / prodFiltrados.length;
        return new Response(JSON.stringify(promedio), {status: 200});
        
      }else if(maxPrecio){
        const prodFiltrados = productos.filter(elem => elem.precio <= Number(maxPrecio));
        const promedio = prodFiltrados.reduce((acc, elem) => acc + elem.precio, 0) / prodFiltrados.length;
        return new Response(JSON.stringify(promedio), {status: 200});
      }

      const promedio = productos.reduce((acc, elem) => acc + elem.precio, 0) / productos.length;
      return new Response(JSON.stringify(promedio), {status: 200});
    }
  }

  return new Response("Endpoint not found", {status: 404});
}

Deno.serve({port: 3000}, handler);