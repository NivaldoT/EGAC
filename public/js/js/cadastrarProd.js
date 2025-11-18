document.addEventListener('DOMContentLoaded', function(){

    let voltar = document.getElementById('voltar');
    let tipo = document.getElementById('tipoItem');
    tipo.addEventListener('change', function(){
        voltar.href = '/admin/listagem/'+tipo.value;
    })

    // Preview da imagem
    let inputImagem = document.getElementById('inputImagem');
    inputImagem.addEventListener('change', carregarPrevia);

    let precomax = document.getElementById('precoval');
    precomax.addEventListener('keydown', function(){
        if(precomax.value>9999999.00)
            precomax.value = 9999999.00;
    })
    
    let btn = document.getElementById('cadastrar');
    btn.addEventListener('click', function(){

        const nome = document.getElementById('nomeval');
        const preco = document.getElementById('precoval');
        const descricao = document.getElementById('descricaoval');
        const tipoItem = document.getElementById('tipoItem');
        const categoria = document.getElementById('categoriaval');
        const marca = document.getElementById('marcaval');
        const inputImagem = document.getElementById('inputImagem');

        let vetorVal= [];
        if(!nome.value)
            vetorVal.push(nome);
        else
            nome.style.borderColor = '';

        if(!isFinite(Number(preco.value)) || !preco.value || preco.value < 0)
            vetorVal.push(preco);
        else
            preco.style.borderColor = '';

        if(!descricao.value)
            vetorVal.push(descricao);
        else
            descricao.style.borderColor = '';

        if(tipoItem.value == 0)
            vetorVal.push(tipoItem);
        else
            tipoItem.style.borderColor = '';

        if(categoria.value == 0)
            vetorVal.push(categoria);
        else
            categoria.style.borderColor = '';
        if(marca.value == 0)
            vetorVal.push(marca);
        else
            marca.style.borderColor = '';
        
        if(inputImagem.files.length == 0)
            vetorVal.push(inputImagem);
        else
            inputImagem.style.borderColor = '';

        if(vetorVal.length == 0){
            if(nome.value && isFinite(Number(preco.value)) && preco.value && descricao.value && inputImagem.files.length > 0){
                // Usar FormData para enviar arquivo
                let formData = new FormData();
                formData.append('tipoItem', tipoItem.value);
                formData.append('nome', nome.value);
                formData.append('preco', preco.value);
                formData.append('descricao', descricao.value);
                formData.append('categoria', categoria.value);
                formData.append('marca', marca.value);
                formData.append('imagem', inputImagem.files[0]);

                fetch('/admin/cadastrarProd',{
                    method: 'POST',
                    body: formData // Não enviar header Content-Type com FormData
                    })
                    .then(function(resposta) {
                        return resposta.json();
                    })
                    .then(function(corpo) {
                        alert(corpo.msg);
                        if(corpo.ok) {
                            nome.value='';
                            preco.value='';
                            descricao.value='';
                            categoria.value='0';
                            marca.value='0';
                            inputImagem.value='';
                            document.getElementById('divPrevia').style.display = 'none';
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
    })
})

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