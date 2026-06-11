# Instrucoes Prisma: Relacoes entre tabelas

Este guia usa nomes genericos de tabela para explicar relacoes no Prisma de forma didatica.

Pense sempre nestas perguntas:

1. Uma linha se relaciona com uma ou varias linhas da outra tabela?
2. Quem precisa guardar o ID da outra tabela?
3. A relacao tem dados proprios?

## 1. Um para muitos

Exemplo: uma categoria possui varios produtos.

```prisma
model Category {
  id       String    @id @default(auto()) @map("_id") @db.ObjectId
  name     String
  products Product[]
}

model Product {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  name       String
  categoryId String   @db.ObjectId
  category   Category @relation(fields: [categoryId], references: [id])
}
```

Leitura:

```txt
Category tem varios Product.
Product pertence a uma Category.
Product guarda categoryId.
```

Regra:

```txt
No um-para-muitos, o lado "muitos" guarda o ID.
```

## 2. Um para um

Exemplo: um usuario possui um perfil.

```prisma
model User {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  email   String   @unique
  profile Profile?
}

model Profile {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  bio    String
  userId String @unique @db.ObjectId
  user   User   @relation(fields: [userId], references: [id])
}
```

Leitura:

```txt
User pode ter um Profile.
Profile pertence a um User.
Profile guarda userId.
userId usa @unique para impedir dois perfis no mesmo usuario.
```

Regra:

```txt
No um-para-um, escolha um lado para guardar o ID e coloque @unique nesse ID.
```

## 3. Muitos para muitos simples

Exemplo: estudantes fazem varios cursos, e cursos possuem varios estudantes.

```prisma
model Student {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  name    String
  courses Course[]
}

model Course {
  id       String    @id @default(auto()) @map("_id") @db.ObjectId
  title    String
  students Student[]
}
```

Leitura:

```txt
Student tem varios Course.
Course tem varios Student.
```

Observacao:

Em muitos casos, especialmente com MongoDB, pode ser melhor criar uma tabela intermediaria.

## 4. Muitos para muitos com tabela intermediaria

Exemplo: estudantes se matriculam em cursos.

```prisma
model Student {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  enrollments Enrollment[]
}

model Course {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  enrollments Enrollment[]
}

model Enrollment {
  id        String @id @default(auto()) @map("_id") @db.ObjectId

  studentId String  @db.ObjectId
  student   Student @relation(fields: [studentId], references: [id])

  courseId  String @db.ObjectId
  course    Course @relation(fields: [courseId], references: [id])

  createdAt DateTime @default(now())
  status    String
}
```

Leitura:

```txt
Enrollment liga Student com Course.
Enrollment pode guardar dados da relacao.
```

Use tabela intermediaria quando a relacao tiver dados proprios, como:

- data de criacao
- status
- nota
- permissao
- quantidade
- historico

## 5. Quando nao precisa de relacao

Nem tudo precisa virar outra tabela.

Exemplo simples:

```prisma
model Product {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  name  String
  color String
}
```

Aqui `color` e apenas um texto.

Mas se cor tiver dados proprios, pode virar tabela:

```prisma
model Color {
  id       String    @id @default(auto()) @map("_id") @db.ObjectId
  name     String
  hex      String
  products Product[]
}

model Product {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  name    String

  colorId String @db.ObjectId
  color   Color  @relation(fields: [colorId], references: [id])
}
```

## Resumo rapido

```txt
Um A tem varios B
=> B guarda aId
=> A tem B[]
```

```txt
Um A tem um B
=> um dos lados guarda o ID
=> esse ID deve ter @unique
```

```txt
Varios A tem varios B
=> use listas dos dois lados
=> ou crie uma tabela intermediaria
```

```txt
Se e apenas uma informacao simples
=> use String, Int, Boolean, DateTime etc.
=> nao precisa criar relacao
```

## Erro comum

Se voce escreve uma relacao em um model, o Prisma espera o outro lado tambem.

Exemplo incompleto:

```prisma
model Product {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  categoryId String   @db.ObjectId
  category   Category @relation(fields: [categoryId], references: [id])
}

model Category {
  id   String @id @default(auto()) @map("_id") @db.ObjectId
  name String
}
```

O correto:

```prisma
model Category {
  id       String    @id @default(auto()) @map("_id") @db.ObjectId
  name     String
  products Product[]
}
```

Assim o Prisma entende os dois lados da relacao.
