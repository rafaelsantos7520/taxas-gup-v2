-- CreateTable
CREATE TABLE "Bairro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Bairro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Taxa" (
    "id" SERIAL NOT NULL,
    "bairroOrigemId" INTEGER NOT NULL,
    "bairroDestinoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Taxa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bairro_nome_key" ON "Bairro"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Taxa" ADD CONSTRAINT "Taxa_bairroOrigemId_fkey" FOREIGN KEY ("bairroOrigemId") REFERENCES "Bairro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Taxa" ADD CONSTRAINT "Taxa_bairroDestinoId_fkey" FOREIGN KEY ("bairroDestinoId") REFERENCES "Bairro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
