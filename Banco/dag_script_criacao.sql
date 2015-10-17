-- ------------------------------------------------------------
-- Tabela de dominio que contem os tipos de bolhas que podem ser criados pelo usuario
-- ------------------------------------------------------------

CREATE TABLE dag_tipo (
  id_tipo INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(20) NULL,
  descricao VARCHAR(50) NULL,
  PRIMARY KEY(id_tipo)
);

CREATE TABLE dag_usuario (
  id_usuario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(20) NOT NULL,
  sobrenome VARCHAR(45) NOT NULL,
  email VARCHAR(100) NOT NULL,
  login VARCHAR(100) NOT NULL,
  senha VARCHAR(20) NULL,
  PRIMARY KEY(id_usuario)
);

-- ------------------------------------------------------------
-- Tabela para armazenamento das informações das bolhas ativas.
-- ------------------------------------------------------------

CREATE TABLE dag_bolha (
  id_bolha INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario INTEGER UNSIGNED NOT NULL,
  id_tipo INTEGER UNSIGNED NOT NULL,
  nome VARCHAR(20) NOT NULL,
  dt_hora_criacao DATETIME NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  ind_restrita INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(id_bolha),
  INDEX idx_dag_tipo_dag_bol_id_tipo(id_tipo),
  INDEX idx_dag_usr_dag_bol_id_usuario(id_usuario),
  FOREIGN KEY(id_tipo)
    REFERENCES dag_tipo(id_tipo)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(id_usuario)
    REFERENCES dag_usuario(id_usuario)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE dag_bolha_historico (
  id_bolha_historico INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario INTEGER UNSIGNED NOT NULL,
  id_tipo INTEGER UNSIGNED NOT NULL,
  nome VARCHAR(20) NOT NULL,
  dt_hora_criacao DATETIME NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  ind_restrita INTEGER NOT NULL DEFAULT 0,
  qtd_max INTEGER UNSIGNED NULL,
  PRIMARY KEY(id_bolha_historico),
  INDEX idx_dag_tipo_dag_bol_hist_id_tipo(id_tipo),
  INDEX idx_dag_usr_dag_bol_hist_id_usuario(id_usuario),
  FOREIGN KEY(id_tipo)
    REFERENCES dag_tipo(id_tipo)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(id_usuario)
    REFERENCES dag_usuario(id_usuario)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE dag_usuario_bolha (
  id_bolha INTEGER UNSIGNED NOT NULL,
  id_usuario INTEGER UNSIGNED NOT NULL,
  ind_ativo INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(id_bolha, id_usuario),
  INDEX idx_dag_bol_dag_usr_bol_id_bolha(id_bolha),
  INDEX idx_dag_usr_dag_usr_bol_id_usuario(id_usuario),
  FOREIGN KEY(id_bolha)
    REFERENCES dag_bolha(id_bolha)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(id_usuario)
    REFERENCES dag_usuario(id_usuario)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);