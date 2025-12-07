document.addEventListener('DOMContentLoaded',  function(){

    document.getElementById("excelCaixa").addEventListener("click", exportarExcelCaixa);
    function exportarExcelCaixa() {
        let nomeArq = "Movimentos-Caixa-"+(new Date().toLocaleDateString('pt-br'))+".xlsx";
        var wb = XLSX.utils.table_to_book(document.getElementById("movimentosCaixa"));
        XLSX.writeFile(wb, nomeArq);
    }

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
        fetch('/admin/caixa/getStatus')     //VERIFICA SE O FUNCIONARIO TEM UM CAIXA ABERTO E TRAZ ESTE CAIXA COMO OBJ
        .then(function(resposta){
            return resposta.json()
        })
        .then(function(corpo){
            let caixaModel = corpo.caixa;
            let htmlAlert;       //Caixa de Status do caixa modal
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

                caixaValor.textContent = 'Valor: R$00,00';

                document.getElementById('exportarCaixa').style.display = 'none';  //ESCONDE BOTÃO EXPORTAR CAIXA

                document.getElementById('statusCaixa').innerHTML = htmlAlert;
            }
            if(caixaModel.status == 1){
                fetch('/admin/movimentos/buscarDeCaixa/'+caixaModel.id)     //BUSCA OS MOVIMENTOS DO CAIXA ABERTO PELO IDCAIXA
                .then(function(resposta){
                    return resposta.json()
                })
                .then(function(corpo){
                    document.getElementById('nomeCaixaSpan').textContent = 'Funcionário Responsável: '+caixaModel.nomeFunc;
                    document.getElementById('dataCaixaSpan').textContent = 'Data e Hora de Abertura: '+new Date(caixaModel.dataAbertura).toLocaleString('pt-br');
                    let listaMovimentos = corpo.lista;
                    let tbody = '';
                    if(listaMovimentos.length>0){
                        for(let i=0; i<listaMovimentos.length;i++){
                            let mov = listaMovimentos[i];
                            let tipoOperacao = '';
                            let idOperacao = '-';
                            
                            if(mov.operacao == 0) {
                                tipoOperacao = 'Abertura de Caixa';
                                idOperacao = '-';
                            } else if(mov.operacao == 1) {
                                tipoOperacao = 'Conta a Pagar';
                                idOperacao = mov.idContaPagar || '-';
                            } else if(mov.operacao == 2) {
                                tipoOperacao = 'Conta a Receber';
                                idOperacao = mov.idContaReceber || '-';
                            } else if(mov.operacao == 3) {
                                tipoOperacao = 'Entrada Manual';
                                idOperacao = '-';
                            } else if(mov.operacao == 4) {
                                tipoOperacao = 'Saída Manual';
                                idOperacao = '-';
                            }
                            
                            tbody += `
                                <tr>
                                    <td>${mov.id}</td>
                                    <td>${tipoOperacao}</td>
                                    <td>${idOperacao}</td>
                                    <td>R$${(mov.valor).toFixed(2)}</td>
                                    <td>${new Date(mov.data).toLocaleDateString('pt-br')+' / '+new Date(mov.data).toLocaleTimeString('pt-br')}</td>
                                </tr>` 
                        }
                    }
                    htmlAlert = `<div class='alert alert-success'>Caixa aberto - Valor atual: R$${Number((caixaModel.valor)).toFixed(2)}</div>`;
                    caixa.textContent = 'Caixa: Aberto';
                    caixaModal.innerHTML = `
                        <div class="table-responsive">
                            <table id="movimentosCaixa" class="table table-hover table-striped">
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

                    document.getElementById('exportarCaixa').style.display = 'inline-flex';   //MOSTRA BOTÃO EXPORTAR CAIXA

                    document.getElementById('modalDialog').classList.add('modal-xl'); // AUMENTA O TAMANHO DO MODAL
                    document.getElementById('statusCaixa').innerHTML = htmlAlert;
                })
            }

        })
    }

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
        if(confirm('Confirma o fechamento do caixa?')){

            fetch('/admin/caixa/getStatus')     //VERIFICA SE O FUNCIONARIO TEM UM CAIXA ABERTO E TRAZ ESTE CAIXA COMO OBJ
            .then(function(resposta){
                return resposta.json()
            })
            .then(function(corpo){
                let caixaModel = corpo.caixa;
                obj = {idCaixa: caixaModel.id}
                fetch('/admin/caixa/fechar',{
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
            })
        
        }
    }
})