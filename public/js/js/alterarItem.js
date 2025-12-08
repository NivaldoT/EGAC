// Função para mostrar toast notification (global)
function showToast(title, message, type) {
    // Remover toasts existentes
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    const icon = type === 'success' ? '✓' : '×';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remover após 3 segundos
    setTimeout(function() {
        toast.classList.add('hiding');
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function(){

    let voltar = document.getElementById('voltar');
    let tipo = document.getElementById('tipoItem');
    MudarEnderecoVoltar();
    function MudarEnderecoVoltar(){
        voltar.href = '/admin/listagem/'+tipo.value;
    }

    // Preview da imagem 
    let inputImagem = document.getElementById('inputImagem');
    if(inputImagem) {
        inputImagem.addEventListener('change', carregarPrevia);
    }

    let precomax = document.getElementById('precoval');
    if(precomax) {
        precomax.addEventListener('keydown', function(){
            if(precomax.value>9999999.00)
                precomax.value = 9999999.00;
        })
    }

    let inputBuscar = document.getElementById('procurarPessoaval');  //Buscar Pessoas Equipamento Agricola
    if(inputBuscar) {
        inputBuscar.addEventListener('blur', function(){

            let nome = {nome : inputBuscar.value};
            fetch("/admin/buscarCliente",{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(nome)
                })
            .then(function(resposta){
                return resposta.json();
            })
            .then(function(corpo){
                let selectPessoa = document.getElementById('pessoaval');
                selectPessoa.innerHTML = '';
                if(corpo.lista.length == 0 ){
                    selectPessoa.innerHTML = '<option value="0">Pessoa não existente no banco de dados!</option>'
                }
                for(let i=0; i < corpo.lista.length;i++){
                    pessoa = corpo.lista[i];
                    selectPessoa.innerHTML += '<option value="'+pessoa.id+'">'+pessoa.nome+'</option>' 
                }
            })
        });
    }

    let btn = document.getElementById('cadastrar');
    if(btn) {
        btn.addEventListener('click', gravar);
    }

    let tipoItem = document.getElementById('tipoItem');
    
    if(tipoItem) {
        tipoItem.addEventListener('change', change)
        change();
    }
    
    function change(){
        const preco = document.getElementById('preco');
        const inputPessoa = document.getElementById('procurarPessoaval');
        const pessoa = document.getElementById('pessoaval');
        const descricao = document.getElementById('descricao');
        const marca = document.getElementById('marca');
        const categoria = document.getElementById('categoria');
        
        if(!tipoItem) return;
        
        if(tipoItem.value == 1 || tipoItem.value == 2){ //PRODUTO INSUMO
            if(preco) preco.style.display = 'block';            
            if(inputPessoa) inputPessoa.style.display = 'none';
            if(pessoa) pessoa.style.display = 'none';
            if(descricao) descricao.style.display = 'block';
            if(marca) marca.style.display = 'block';
            if(categoria) categoria.style.display = 'block';
        }
        if(tipoItem.value == 3){ //serviço
            if(preco) preco.style.display = 'block';  
            if(inputPessoa) inputPessoa.style.display = 'none';
            if(pessoa) pessoa.style.display = 'none';
            if(descricao) descricao.style.display = 'block';
            if(marca) marca.style.display = 'none';
            if(categoria) categoria.style.display = 'none';
        }
        if(tipoItem.value == 4){ // equip Agricola
            if(preco) preco.style.display = 'none';
            if(inputPessoa) inputPessoa.style.display = 'block';
            if(pessoa) pessoa.style.display = 'block';
            if(descricao) descricao.style.display = 'block';
            if(marca) marca.style.display = 'block';
            if(categoria) categoria.style.display = 'block';
        }
        if(tipoItem.value == 5){ // marca 
            if(preco) preco.style.display = 'none';
            if(inputPessoa) inputPessoa.style.display = 'none';
            if(pessoa) pessoa.style.display = 'none';
            if(descricao) descricao.style.display = 'none';
            if(marca) marca.style.display = 'none';
            if(categoria) categoria.style.display = 'none';
        }
        if(tipoItem.value == 6){ // categoria
            if(preco) preco.style.display = 'none';
            if(inputPessoa) inputPessoa.style.display = 'none';
            if(pessoa) pessoa.style.display = 'none';
            if(descricao) descricao.style.display = 'none';
            if(marca) marca.style.display = 'none';
            if(categoria) categoria.style.display = 'none';
        }
    }

    function gravar(){
        console.log('Função gravar chamada');
        
        const id = document.getElementById('prodId');
        const nome = document.getElementById('nomeval');
        const preco = document.getElementById('precoval');
        const pessoaEl = document.getElementById('pessoaval');
        const descricao = document.getElementById('descricaoval');
        const marca = document.getElementById('marcaval');
        const tipoItem = document.getElementById('tipoItem');
        const categoria = document.getElementById('categoriaval');

        console.log('Elementos encontrados:', {
            id: !!id,
            nome: !!nome,
            preco: !!preco,
            descricao: !!descricao,
            marca: !!marca,
            tipoItem: !!tipoItem,
            categoria: !!categoria
        });

        // Validação básica apenas do nome e tipoItem (sempre necessários)
        if(!nome || !tipoItem) {
            console.error('Elementos obrigatórios não encontrados');
            alert('Erro: Elementos do formulário não encontrados!');
            return;
        }

        let vetorVal= [];
        if(!nome.value)
            vetorVal.push(nome);
        else
            nome.style.borderColor = '';

        // Validar preço apenas se o campo existir (não existe para Marca e Categoria)
        if(preco && (!isFinite(Number(preco.value)) || !preco.value || preco.value < 0))
            vetorVal.push(preco);
        else if(preco)
            preco.style.borderColor = '';

        if(pessoaEl && pessoaEl.value == 0)
            vetorVal.push(pessoaEl);
        else if(pessoaEl)
            pessoaEl.style.borderColor = '';
            
        // Validar descrição apenas se o campo existir (não existe para Marca e Categoria)
        if(descricao && !descricao.value)
            vetorVal.push(descricao);
        else if(descricao)
            descricao.style.borderColor = '';

        if(marca && marca.value == 0)
            vetorVal.push(marca);
        else if(marca)
            marca.style.borderColor = '';

        if(tipoItem.value == 0)
            vetorVal.push(tipoItem);
        else
            tipoItem.style.borderColor = '';
        
        if(categoria && categoria.value == 0)
            vetorVal.push(categoria);
        else if(categoria)
            categoria.style.borderColor = '';
            
        console.log('Valores:', {
            tipoItem: tipoItem.value,
            nome: nome.value, 
            preco: preco?.value, 
            descricao: descricao?.value, 
            categoria: categoria?.value, 
            marca: marca?.value
        });
        console.log('Erros de validação:', vetorVal.length);
        
        if(tipoItem.value == 1 || tipoItem.value == 2){ // PRODUTO INSUMO
            console.log('Processando produto/insumo');
            if(nome.value && isFinite(Number(preco.value)) && preco.value && descricao.value && preco.value >= 0){
                console.log('Validação passou, enviando dados...');
                // Usar FormData para enviar arquivo
                let formData = new FormData();
                formData.append('id', id.value);
                formData.append('tipoItem', tipoItem.value);
                formData.append('nome', nome.value);
                formData.append('preco', preco.value);
                formData.append('descricao', descricao.value);
                formData.append('categoria', categoria ? parseInt(categoria.value) : 0);
                formData.append('marca', marca ? parseInt(marca.value) : 0);
                
                // Adicionar estoque
                const estoque = document.getElementById('estoqueval');
                if(estoque) {
                    formData.append('estoque', parseInt(estoque.value) || 0);
                }
                
                // Adicionar imagem se foi selecionada
                let inputImagem = document.getElementById('inputImagem');
                if(inputImagem && inputImagem.files.length > 0) {
                    formData.append('imagem', inputImagem.files[0]);
                }

                fetch('/admin/alterarProduto',{
                    method: 'POST',
                    body: formData
                    })
                    .then(function(resposta) {
                        return resposta.json();
                    })
                    .then(function(corpo) {
                        if(corpo.ok) {
                            showToast('Sucesso!', corpo.msg, 'success');
                            setTimeout(function() {
                                window.location.href = '/admin/listagem/' + tipoItem.value;
                            }, 1500);
                        } else {
                            showToast('Erro!', corpo.msg, 'error');
                        }
                    })
                    .catch(function(erro) {
                        console.error('Erro:', erro);
                        showToast('Erro!', 'Erro ao salvar produto!', 'error');
                    });
                return
            } else {
                showToast('Atenção!', 'Preencha todos os campos obrigatórios!', 'error');
                vetorVal.forEach(campo => {
                    if(campo) campo.style.borderColor = 'red';
                });
            }
        }
        if(tipoItem.value == 3){ // SERVICO
            if(nome.value && isFinite(Number(preco.value)) && preco.value && descricao.value != 0 && preco.value >= 0){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value,
                    preco: preco.value,
                    descricao: descricao.value
                }
                fetch('/admin/alterarServico',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                    })
                    .then(function(resposta) {//recebe a resposta como retorno do fetch
                        return resposta.json(); //converte o corpo da resposta para json (gera uma nova promise)
                    })
                    .then(function(corpo) {//recebe o corpo em formato de obj genérico
                        if(corpo.msg && corpo.msg.includes('Sucesso')) {
                            showToast('Sucesso', 'Serviço alterado com sucesso!', 'success');
                            setTimeout(() => window.location.href = '/admin/listagem/3', 1500);
                        } else {
                            showToast('Erro', corpo.msg || 'Erro ao alterar serviço', 'error');
                        }
                })
                return
            }
        }
        if(tipoItem.value == 4){ //EQUIPAMENTO AGRICOLA
            if(nome.value && pessoa.value != 0 && marca.value != 0 && categoria.value != 0){
                obj = {
                    id: id.value,
                    nome : nome.value,
                    pessoa: pessoa.value,
                    marca: marca.value,
                    descricao: descricao.value,
                    categoria: categoria.value
                }
                fetch('/admin/alterarEquipAgricola',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                    })
                    .then(function(resposta) {//recebe a resposta como retorno do fetch
                        return resposta.json(); //converte o corpo da resposta para json (gera uma nova promise)
                    })
                    .then(function(corpo) {//recebe o corpo em formato de obj genérico
                        if(corpo.msg && corpo.msg.includes('Sucesso')) {
                            showToast('Sucesso', 'Equipamento Agrícola alterado com sucesso!', 'success');
                            setTimeout(() => window.location.href = '/admin/listagem/4', 1500);
                        } else {
                            showToast('Erro', corpo.msg || 'Erro ao alterar equipamento', 'error');
                        }
                })
                return
            }
        }
        if(tipoItem.value == 5){ // MARCA
            if(nome.value){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value
                }
                fetch('/admin/alterarMarca',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                    })
                    .then(function(resposta) {//recebe a resposta como retorno do fetch
                        return resposta.json(); //converte o corpo da resposta para json (gera uma nova promise)
                    })
                    .then(function(corpo) {//recebe o corpo em formato de obj genérico
                        if(corpo.msg && corpo.msg.includes('Sucesso')) {
                            showToast('Sucesso', 'Marca alterada com sucesso!', 'success');
                            setTimeout(() => window.location.href = '/admin/listagem/5', 1500);
                        } else {
                            showToast('Erro', corpo.msg || 'Erro ao alterar marca', 'error');
                        }
                })
                return
            }
        }
        if(tipoItem.value == 6){ // CATEGORIA
            if(nome.value){
                obj = {
                    id: id.value,
                    tipoItem : tipoItem.value,
                    nome : nome.value
                }
                fetch('/admin/alterarCategoria',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                    })
                    .then(function(resposta) {//recebe a resposta como retorno do fetch
                        return resposta.json(); //converte o corpo da resposta para json (gera uma nova promise)
                    })
                    .then(function(corpo) {//recebe o corpo em formato de obj genérico
                        if(corpo.msg && corpo.msg.includes('Sucesso')) {
                            showToast('Sucesso', 'Categoria alterada com sucesso!', 'success');
                            setTimeout(() => window.location.href = '/admin/listagem/6', 1500);
                        } else {
                            showToast('Erro', corpo.msg || 'Erro ao alterar categoria', 'error');
                        }
                })
                return
            }
        }
    
        else{
            alert('Favor Preencher os Campos Obrigatórios!');
            for(let i=0; i<vetorVal.length; i++){
                vetorVal[i].style.borderColor = 'red';
            }
        }
    }

    function carregarPrevia() {
        if(this.files.length > 0) {
            const arquivo = this.files[0];
            const tamanhoMaximo = 2 * 1024 * 1024; // 2MB em bytes
            
            // Validar tamanho
            if(arquivo.size > tamanhoMaximo) {
                alert('A imagem é muito grande! Tamanho máximo: 2MB');
                this.value = '';
                document.getElementById('divPrevia').style.display = 'none';
                return;
            }
            
            // Validar tipo
            const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if(!tiposPermitidos.includes(arquivo.type)) {
                alert('Formato não permitido! Use: JPG, JPEG, PNG ou WebP');
                this.value = '';
                document.getElementById('divPrevia').style.display = 'none';
                return;
            }
            
            let img = document.getElementById('previaImagem');
            let urlImg = URL.createObjectURL(this.files[0]);
            img.src = urlImg;
            document.getElementById('divPrevia').style.display = 'block';
        }
    }
})