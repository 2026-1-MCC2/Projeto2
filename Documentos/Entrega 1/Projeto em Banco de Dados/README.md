As tabelas criadas para o sistema do marketplace foram: Usuarios, Pedidos, Produtos, Itens_Pedidos, Favoritos e Avaliacoes_Produtos.
A tabela Usuarios possui uma chave primária que garante a unicidade de cada cadastro, evitando a duplicidade de registros e assegurando a organização do histórico de compras e interações dos usuários no sistema.
A tabela Pedidos contém uma chave primária para identificar cada pedido de forma única e uma chave estrangeira que estabelece o relacionamento com a tabela Usuarios, permitindo associar cada pedido ao respectivo usuário responsável pela compra.
A tabela Itens_Pedidos segue a mesma lógica, possuindo uma chave primária para identificação individual dos itens e chaves estrangeiras que a conectam às tabelas Pedidos e Produtos. Essa estrutura garante a integridade dos dados relacionados às vendas, armazenando inclusive o preço praticado no momento exato da transação, preservando o histórico comercial.
Além disso, foi implementada a tabela Favoritos, que permite ao usuário salvar produtos de seu interesse. Essa tabela possui chaves estrangeiras que estabelecem relacionamento com as tabelas Usuarios e Produtos, viabilizando funcionalidades como listas de desejo e personalização da experiência do cliente no site.
Por fim, a tabela Avaliacoes_Produtos foi adicionada para possibilitar que os usuários avaliem os produtos adquiridos. Ela armazena a nota, comentário e data da avaliação, relacionando‑se às tabelas Usuarios e Produtos por meio de chaves estrangeiras, tornando possível a exibição de avaliações e médias de pontuação nos produtos.
Relações entre as tabelas:
Uma relação entre Usuarios e Pedidos com cardinalidade (0,n)
Uma relação entre Pedidos e Itens_Pedidos com cardinalidade (1,n)
Uma relação entre Produtos e Itens_Pedidos com cardinalidade (0,n)
Uma relação entre Usuarios e Favoritos com cardinalidade (0,n)
Uma relação entre Produtos e Favoritos com cardinalidade (0,n)
Uma relação entre Usuarios e Avaliacoes_Produtos com cardinalidade (0,n)
Uma relação entre Produtos e Avaliacoes_Produtos com cardinalidade (0,n)
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

Table Favoritos {
  ID_Favorito int [pk, increment] // PK
  ID_Usuario int [ref: > Usuarios.ID_usuario] // FK (Usuarios)
  ID_Produto int [ref: > Produtos.ID_Produto] // FK (Produtos)
  Data_Favorito datetime
}

Table Avaliacoes_Produtos {
  ID_Avaliacao int [pk, increment] // PK
  ID_Usuario int [ref: > Usuarios.ID_usuario] // FK (Usuarios)
  ID_Produto int [ref: > Produtos.ID_Produto] // FK (Produtos)
  Nota int
  Comentario varchar
  Data_Avaliacao datetime
}

<img width="704" height="389" alt="Captura de tela 2026-03-30 094747" src="https://github.com/user-attachments/assets/d2f3fda1-272c-4b9e-b795-20f83fd3453a" />

