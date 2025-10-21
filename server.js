const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const routerHome = require("./routes/homeRoute");
const routerUsuario = require("./routes/usuarioRoute");
const routerAdmin = require("./routes/adminRoute");

const server = express();

//configurações do EJS
server.set("view engine", 'ejs')

//Expor a pasta de estilização/script para o navegador
server.use(express.static('public'));

//Configuração arquivo de Layout
server.set('layout', './layout.ejs');
server.use(expressEjsLayouts);

//Configuração para as requisições POST (Submissão)
server.use(express.urlencoded({extended: true}));
//Configurar a possibilidade de fazer parse em uma string JSON
server.use(express.json());


server.use("/", routerHome);
server.use('/usuario',routerUsuario);

server.use('/admin',routerAdmin);

server.listen(5550, function() {
    console.log("servidor web em funcionamento na porta 5550!");
})
