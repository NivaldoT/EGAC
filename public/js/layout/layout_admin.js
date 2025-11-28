document.addEventListener('DOMContentLoaded',  function(){

    function validarInicialCaixa(){
        if(this.value>9999999)
            this.value = 9999999;
    }

    let caixa = document.getElementById('caixaStatus');
    let caixaValor = document.getElementById('caixaValor');

    let acaoBtnCaixa = document.getElementById('acaoBtnCaixa');
    
    let caixaModal = document.getElementById('caixaModal'); 
    getCaixa()
    function getCaixa(){
        fetch('/admin/caixa/getStatus')
        .then(function(resposta){
            return resposta.json()
        })
        .then(function(corpo){
            let caixaModel = corpo.caixa;
            let htmlAlert;
            if(caixaModel.status == 0){
                htmlAlert = `<div class='alert alert-warning'>Nenhum caixa aberto</div>`;
                caixa.textContent = 'Caixa: Fechado';
                caixaModal.innerHTML = `<h5>Abrir Caixa</h5>
                                        <div class="form-floating">
                                            <input type="number" name="valorInicialCaixa" class="form-control" placeholder=" " required id="valorInicialCaixa">
                                            <label>Valor Inicial</label>
                                        </div>`;
                let inputCaixaValor = document.getElementById('valorInicialCaixa');
                inputCaixaValor.addEventListener('keypress', validarInicialCaixa);

                acaoBtnCaixa.addEventListener('click', abrirCaixa);         //MUDA O BOTÃO DE AÇÃO DO MODAL
                acaoBtnCaixa.classList = 'btn btn-success';
                acaoBtnCaixa.textContent = 'Abrir Caixa';
                acaoBtnCaixa.removeEventListener('click', fecharCaixa);

                document.getElementById('statusCaixa').innerHTML = htmlAlert;
            }
            if(caixaModel.status == 1){
                fetch('/admin/movimentos/buscarDeCaixa/'+caixaModel.id)
                .then(function(resposta){
                    return resposta.json()
                })
                .then(function(corpo){
                    let listaMovimentos = corpo.lista;
                    let tbody = '';
                    if(listaMovimentos.length>0){
                        for(let i=0; i<listaMovimentos.length;i++){
                            tbody += `
                                <tr>
                                    <td>${listaMovimentos[i].id}</td>
                                    <td>${listaMovimentos[i].operacao == 1 ? 'Conta a Pagar':'Conta a Receber'}</td>
                                    <td>${listaMovimentos[i].operacao == 1? listaMovimentos[i].idContaPagar: listaMovimentos[i].idContaReceber}</td>
                                    <td>R$${(listaMovimentos[i].valor).toFixed(2)}</td>
                                    <td>${new Date(listaMovimentos[i].data).toLocaleDateString('pt-br')+' / '+new Date(listaMovimentos[i].data).toLocaleTimeString('pt-br')}</td>
                                </tr>` 
                        }
                    }
                    htmlAlert = `<div class='alert alert-success'>Caixa aberto - Valor atual: R$${Number((caixaModel.valor)).toFixed(2)}</div>`;
                    caixa.textContent = 'Caixa: Aberto';
                    caixaModal.innerHTML = `
                        <div class="table-responsive">
                            <table id="pedidos" class="table table-hover table-striped">
                            <h5>Movimentos deste Caixa</h5>
                                <thead class="table-light">
                                    <tr>
                                        <th>Movimento ID</th>
                                        <th>Operação</th>
                                        <th>ID Operação</th>
                                        <th>Valor</th>
                                        <th>Data e Horário</th>
                                    </tr>
                                </thead>
                                <tbody>${tbody}</tbody>
                            </table>
                        </div>`;

                    caixaValor.style.display = 'block';
                    caixaValor.textContent = 'Valor: R$'+caixaModel.valor;

                    acaoBtnCaixa.addEventListener('click', fecharCaixa);
                    acaoBtnCaixa.classList = 'btn btn-danger';
                    acaoBtnCaixa.textContent = 'Fechar Caixa';
                    acaoBtnCaixa.removeEventListener('click', abrirCaixa);

                    document.getElementById('modalDialog').classList.add('modal-xl'); // AUMENTA O TAMANHO DO MODAL;
                    document.getElementById('statusCaixa').innerHTML = htmlAlert;
                })
            }

        })
    }
    //document.getElementById('abrirCaixa').addEventListener('click', abrirCaixa);
    //document.getElementById('fecharCaixa').addEventListener('click', fecharCaixa);

    function abrirCaixa(){
        let inputValor = document.getElementById('valorInicialCaixa');
        let valor = inputValor.value;
        if(Number(valor) && valor>0){
            obj = {valor: valor}
            fetch('/admin/caixa/abrir',{
                method:'POST',
                headers: {
                    'Content-type':'application/json'                
                },
                body: JSON.stringify(obj)
            })
            .then(function(resposta){
                return resposta.json()
            })
            .then(function (corpo){
                alert(corpo.msg)
                getCaixa();
            })
        }
        else{
            alert('Valor Inválido!!');
        }
    }

    function fecharCaixa(){
        alert('fecho')
    }
})