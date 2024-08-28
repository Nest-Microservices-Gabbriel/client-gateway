## Cliente Gataway

El gateaway es el punto de comunicacion entre nuestros clientes y neustros servicios.
Es el encargado de recibir las peticiones, enviarlas a los serviciios correspondientes y devolver la respuesta el cliente

## dev

1. Clonar el repo
2. instalar deps
3. Crear el .env
4. Levantar el servidor de nats

```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats

```

5. Tener levandado los microservicios
6. levantar el proyecto con 'npm run start:dev'
