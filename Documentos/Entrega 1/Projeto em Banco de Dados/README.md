As tabelas criadas para o sistema de e-commerce foram: Usuarios, Pedidos, Produtos e Itens_Pedidos.
A tabela Usuarios possui chaves primárias para que os logins e cadastros não se repitam, o que poderia desorganizar o histórico de compras. A tabela Pedidos possui uma chave primária para evitar duplicidade de registros e também uma chave estrangeira para conectar com a tabela Usuarios.
Assim como na tabela de Pedidos, a mesma lógica se aplica à Itens_Pedidos, que possui uma chave primária para identificar cada registro de forma única e chaves estrangeiras para se relacionar tanto com a tabela Pedidos quanto com a tabela Produtos. Essa estrutura garante a integridade dos valores vendidos, armazenando o preço praticado no momento exato da transação.

Assim:
Uma relação entre as tabelas Usuarios e Pedidos com a cardinalidade (0,n)
Uma relação entre Pedidos e Itens_Pedidos com a cardinalidade (1,n)
Uma relação entre Produtos e Itens_Pedidos com a cardinalidade (0,n)


Demonstração das tabelas:
Table Usuarios {
  ID_usuario int [pk, increment] // PK
  Nome varchar
  Email varchar
  Senha varchar
}

Table Pedidos {
  ID_Pedidos int [pk, increment] // PK
  ID_Usuarios int [ref: > Usuarios.ID_usuario] // FK (Usuarios)
  Status varchar
  Data datetime
}

Table Produtos {
  ID_Produto int [pk, increment] // PK
  Nome varchar
  Descricao varchar
  Preco decimal(10,2)
}

Table Itens_Pedidos {
  ID_Itens_pedidos int [pk, increment] // PK
  ID_Pedidos int [ref: > Pedidos.ID_Pedidos] // FK (Pedidos)
  ID_Produto int [ref: > Produtos.ID_Produto] // FK (Produtos)
  Quantidade int
  Preco_Unitario decimal(10,2) // Valor histórico da venda
}

<img width="704" height="389" alt="Captura de tela 2026-03-30 094747" src="https://github.com/user-attachments/assets/d2f3fda1-272c-4b9e-b795-20f83fd3453a" />

