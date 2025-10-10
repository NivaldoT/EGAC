-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema PFS1_10442427754
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema PFS1_10442427754
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `PFS1_10442427754` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `PFS1_10442427754` ;

-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Funcionario` (
  `func_idFuncionario` INT NOT NULL AUTO_INCREMENT,
  `func_nome` VARCHAR(100) NOT NULL,
  `func_cargo` VARCHAR(50) NULL DEFAULT NULL,
  `func_login` VARCHAR(50) NULL DEFAULT NULL,
  `func_senha` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`func_idFuncionario`),
  UNIQUE INDEX `func_login` (`func_login` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Caixa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Caixa` (
  `caixa_idCaixa` INT NOT NULL AUTO_INCREMENT,
  `caixa_dataAbertura` DATE NOT NULL,
  `caixa_dataFechamento` DATE NULL DEFAULT NULL,
  `caixa_saldoInicial` DECIMAL(10,2) NULL DEFAULT NULL,
  `caixa_saldoFinal` DECIMAL(10,2) NULL DEFAULT NULL,
  `caixa_idFuncionario` INT NOT NULL,
  `caixa_justificativa` VARCHAR(100) NULL,
  PRIMARY KEY (`caixa_idCaixa`),
  INDEX `caixa_idFuncionario` (`caixa_idFuncionario` ASC) VISIBLE,
  CONSTRAINT `tb_Caixa_ibfk_1`
    FOREIGN KEY (`caixa_idFuncionario`)
    REFERENCES `PFS1_10442427754`.`tb_Funcionario` (`func_idFuncionario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Categoria` (
  `categoria_id` INT NOT NULL AUTO_INCREMENT,
  `categoria_nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`categoria_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Cliente` (
  `cli_idCliente` INT NOT NULL AUTO_INCREMENT,
  `cli_nome` VARCHAR(100) NOT NULL,
  `cli_cpf` CHAR(11) NOT NULL,
  `cli_telefone` VARCHAR(20) NULL DEFAULT NULL,
  `cli_senha` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`cli_idCliente`),
  UNIQUE INDEX `cli_cpf` (`cli_cpf` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Fornecedor` (
  `forn_idFornecedor` INT NOT NULL AUTO_INCREMENT,
  `forn_nome` VARCHAR(100) NOT NULL,
  `forn_cnpj` CHAR(14) NULL DEFAULT NULL,
  `forn_telefone` VARCHAR(20) NULL DEFAULT NULL,
  `forn_email` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`forn_idFornecedor`),
  UNIQUE INDEX `forn_cnpj` (`forn_cnpj` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Compra` (
  `comp_idCompra` INT NOT NULL AUTO_INCREMENT,
  `comp_data` DATE NOT NULL,
  `comp_idFuncionario` INT NULL DEFAULT NULL,
  `comp_idFornecedor` INT NULL DEFAULT NULL,
  `comp_valorTotal` DECIMAL(10,2) NULL DEFAULT NULL,
  PRIMARY KEY (`comp_idCompra`),
  INDEX `comp_idFuncionario` (`comp_idFuncionario` ASC) VISIBLE,
  INDEX `comp_idFornecedor` (`comp_idFornecedor` ASC) VISIBLE,
  CONSTRAINT `tb_Compra_ibfk_1`
    FOREIGN KEY (`comp_idFuncionario`)
    REFERENCES `PFS1_10442427754`.`tb_Funcionario` (`func_idFuncionario`),
  CONSTRAINT `tb_Compra_ibfk_2`
    FOREIGN KEY (`comp_idFornecedor`)
    REFERENCES `PFS1_10442427754`.`tb_Fornecedor` (`forn_idFornecedor`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_ContaPagar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_ContaPagar` (
  `contpag_idConta` INT NOT NULL AUTO_INCREMENT,
  `contpag_descricao` VARCHAR(100) NULL DEFAULT NULL,
  `contpag_valor` DECIMAL(10,2) NULL DEFAULT NULL,
  `contpag_vencimento` DATE NULL DEFAULT NULL,
  `contpag_idCompra` INT NULL DEFAULT NULL,
  PRIMARY KEY (`contpag_idConta`),
  INDEX `contpag_idCompra` (`contpag_idCompra` ASC) VISIBLE,
  CONSTRAINT `tb_ContaPagar_ibfk_1`
    FOREIGN KEY (`contpag_idCompra`)
    REFERENCES `PFS1_10442427754`.`tb_Compra` (`comp_idCompra`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Venda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Venda` (
  `ven_idVenda` INT NOT NULL AUTO_INCREMENT,
  `ven_data` DATE NOT NULL,
  `ven_idCliente` INT NULL DEFAULT NULL,
  `ven_valorTotal` DECIMAL(10,2) NULL DEFAULT NULL,
  PRIMARY KEY (`ven_idVenda`),
  INDEX `ven_idCliente` (`ven_idCliente` ASC) VISIBLE,
  CONSTRAINT `tb_Venda_ibfk_1`
    FOREIGN KEY (`ven_idCliente`)
    REFERENCES `PFS1_10442427754`.`tb_Cliente` (`cli_idCliente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_TipoProduto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_TipoProduto` (
  `tipo_id` INT NOT NULL AUTO_INCREMENT,
  `tipo_descricao` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`tipo_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Produto` (
  `prod_id` INT NOT NULL AUTO_INCREMENT,
  `prod_tipo` INT NOT NULL,
  `prod_nome` VARCHAR(50) NOT NULL,
  `prod_preco` DECIMAL(10,2) NOT NULL,
  `prod_descricao` VARCHAR(100) NULL DEFAULT NULL,
  `prod_categoria` INT NOT NULL,
  PRIMARY KEY (`prod_id`),
  INDEX `categkey_idx` (`prod_categoria` ASC) VISIBLE,
  INDEX `tipo_idx` (`prod_tipo` ASC) VISIBLE,
  CONSTRAINT `categKey`
    FOREIGN KEY (`prod_categoria`)
    REFERENCES `PFS1_10442427754`.`tb_Categoria` (`categoria_id`),
  CONSTRAINT `tipo`
    FOREIGN KEY (`prod_tipo`)
    REFERENCES `PFS1_10442427754`.`tb_TipoProduto` (`tipo_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_DevolucaoVenda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_DevolucaoVenda` (
  `devo_id` INT NOT NULL AUTO_INCREMENT,
  `devo_motivo` VARCHAR(100) NOT NULL,
  `devo_idVenda` INT NOT NULL,
  `devo_idProduto` INT NOT NULL,
  `devo_status` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`devo_id`),
  INDEX `tb_DevolucaoVenda_ibfk_1` (`devo_idVenda` ASC) VISIBLE,
  INDEX `tb_DevolucaoVenda_ibfk_2` (`devo_idProduto` ASC) VISIBLE,
  CONSTRAINT `tb_DevolucaoVenda_ibfk_1`
    FOREIGN KEY (`devo_idVenda`)
    REFERENCES `PFS1_10442427754`.`tb_Venda` (`ven_idVenda`),
  CONSTRAINT `tb_DevolucaoVenda_ibfk_2`
    FOREIGN KEY (`devo_idProduto`)
    REFERENCES `PFS1_10442427754`.`tb_Produto` (`prod_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Marca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Marca` (
  `marca_id` INT NOT NULL AUTO_INCREMENT,
  `marca_nome` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`marca_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_EquipamentoAgricola`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_EquipamentoAgricola` (
  `eq_id` INT NOT NULL AUTO_INCREMENT,
  `eq_nome` VARCHAR(50) NOT NULL,
  `eq_preco` DECIMAL(10,2) NOT NULL,
  `eq_marcaId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`eq_id`),
  INDEX `eq_marcaId` (`eq_marcaId` ASC) VISIBLE,
  CONSTRAINT `tb_EquipamentoAgricola_ibfk_1`
    FOREIGN KEY (`eq_marcaId`)
    REFERENCES `PFS1_10442427754`.`tb_Marca` (`marca_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Estoque`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Estoque` (
  `est_idProduto` INT NOT NULL,
  `est_quantidade` INT NOT NULL,
  PRIMARY KEY (`est_idProduto`),
  CONSTRAINT `tb_Estoque_ibfk_1`
    FOREIGN KEY (`est_idProduto`)
    REFERENCES `PFS1_10442427754`.`tb_Produto` (`prod_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_ItemCompra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_ItemCompra` (
  `itcomp_idCompra` INT NOT NULL,
  `itcomp_idProduto` INT NOT NULL,
  `itcomp_quantidade` INT NULL DEFAULT NULL,
  `itcomp_precoUnitario` DECIMAL(10,2) NULL DEFAULT NULL,
  PRIMARY KEY (`itcomp_idCompra`, `itcomp_idProduto`),
  INDEX `itcomp_idProduto` (`itcomp_idProduto` ASC) VISIBLE,
  CONSTRAINT `tb_ItemCompra_ibfk_1`
    FOREIGN KEY (`itcomp_idCompra`)
    REFERENCES `PFS1_10442427754`.`tb_Compra` (`comp_idCompra`),
  CONSTRAINT `tb_ItemCompra_ibfk_2`
    FOREIGN KEY (`itcomp_idProduto`)
    REFERENCES `PFS1_10442427754`.`tb_Produto` (`prod_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_ItemVenda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_ItemVenda` (
  `itven_idVenda` INT NOT NULL,
  `itven_idProduto` INT NULL DEFAULT NULL,
  `itven_quantidade` INT NULL DEFAULT NULL,
  `itven_precoUnitario` DECIMAL(10,2) NULL DEFAULT NULL,
  `itven_idEquipamentoAgricola` INT NULL DEFAULT NULL,
  PRIMARY KEY (`itven_idVenda`),
  INDEX `tb_ItemVenda_ibfk_3_idx` (`itven_idEquipamentoAgricola` ASC) VISIBLE,
  INDEX `tb_ItemVenda_ibfk_2` (`itven_idProduto` ASC) VISIBLE,
  CONSTRAINT `tb_ItemVenda_ibfk_2`
    FOREIGN KEY (`itven_idProduto`)
    REFERENCES `PFS1_10442427754`.`tb_Produto` (`prod_id`),
  CONSTRAINT `tb_ItemVenda_ibfk_1`
    FOREIGN KEY (`itven_idVenda`)
    REFERENCES `PFS1_10442427754`.`tb_Venda` (`ven_idVenda`),
  CONSTRAINT `tb_ItemVenda_ibfk_3`
    FOREIGN KEY (`itven_idEquipamentoAgricola`)
    REFERENCES `PFS1_10442427754`.`tb_EquipamentoAgricola` (`eq_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_OrdemDeServico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_OrdemDeServico` (
  `ordem_idOS` INT NOT NULL AUTO_INCREMENT,
  `ordem_descricao` VARCHAR(50) NULL DEFAULT NULL,
  `ordem_status` VARCHAR(20) NULL DEFAULT NULL,
  `ordem_dataAbertura` DATE NOT NULL,
  `ordem_dataConclusao` DATE NULL DEFAULT NULL,
  `ordem_idFuncionario` INT NOT NULL,
  `ordem_idCliente` INT NOT NULL,
  PRIMARY KEY (`ordem_idOS`),
  INDEX `ordem_idFuncionario` (`ordem_idFuncionario` ASC) VISIBLE,
  INDEX `cliFK_idx` (`ordem_idCliente` ASC) VISIBLE,
  CONSTRAINT `tb_OrdemDeServico_ibfk_1`
    FOREIGN KEY (`ordem_idFuncionario`)
    REFERENCES `PFS1_10442427754`.`tb_Funcionario` (`func_idFuncionario`),
  CONSTRAINT `cliFK`
    FOREIGN KEY (`ordem_idCliente`)
    REFERENCES `PFS1_10442427754`.`tb_Cliente` (`cli_idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `PFS1_10442427754`.`tb_Pagamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PFS1_10442427754`.`tb_Pagamento` (
  `pag_idPagamento` INT NOT NULL AUTO_INCREMENT,
  `pag_tipo` VARCHAR(20) NULL DEFAULT NULL,
  `pag_valor` DECIMAL(10,2) NULL DEFAULT NULL,
  `pag_idVenda` INT NULL DEFAULT NULL,
  `pag_idOS` INT NULL DEFAULT NULL,
  PRIMARY KEY (`pag_idPagamento`),
  INDEX `pag_idVenda` (`pag_idVenda` ASC) VISIBLE,
  INDEX `pag_idOS` (`pag_idOS` ASC) VISIBLE,
  CONSTRAINT `tb_Pagamento_ibfk_1`
    FOREIGN KEY (`pag_idVenda`)
    REFERENCES `PFS1_10442427754`.`tb_Venda` (`ven_idVenda`),
  CONSTRAINT `tb_Pagamento_ibfk_2`
    FOREIGN KEY (`pag_idOS`)
    REFERENCES `PFS1_10442427754`.`tb_OrdemDeServico` (`ordem_idOS`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
