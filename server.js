require('dotenv').config()   // CONFIGURAÇÃO DOTENV
//console.log(process.env)

const express = require('express');
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const routerHome = require("./routes/homeRoute");
const routerUsuario = require("./routes/usuarioRoute");
const routerAdmin = require("./routes/adminRoute");
const routerPedidos = require("./routes/pedidosRoute");

const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/authMiddleware');


const server = express();


//configurações do EJS
server.set("view engine", 'ejs')

//Expor a pasta de estilização/script para o navegador
server.use(express.static(path.join(__dirname, 'public')));

//Configuração arquivo de Layout
server.set('layout', './layout.ejs');
server.use(expressEjsLayouts);
server.use(cookieParser());

//Configuração para as requisições POST (Submissão)
server.use(express.urlencoded({extended: true}));
//Configurar a possibilidade de fazer parse em uma string JSON
server.use(express.json());

server.use("/", routerHome);
server.use('/usuario',routerUsuario);
server.use('/pedido',routerPedidos);

let auth = new authMiddleware;
server.use(auth.verificarUsuarioLogado)
server.use('/admin',routerAdmin);

// Config de caminho para imagens de produtos
global.CAMINHO_IMG_PRODUTOS = "/images/produtos/";
global.CAMINHO_IMG_PRODUTOS_ABS = __dirname + "/public/images/produtos/";

server.listen(5550, function() {
    console.log("servidor web em funcionamento na porta 5550!");
})
