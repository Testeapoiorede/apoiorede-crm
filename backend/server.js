const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API ApoioRede funcionando 🚀");
});

app.post("/auth/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || "OPERADOR",
      },
    });

    res.json({
      message: "Cadastro realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: "Erro ao cadastrar usuário",
      details: error.message,
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "E-mail ou senha inválidos",
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: "E-mail ou senha inválidos",
      });
    }

    res.json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: "Erro ao fazer login",
      details: error.message,
    });
  }
});

app.get("/clinics", async (req, res) => {
  const clinics = await prisma.clinic.findMany();
  res.json(clinics);
});

app.post("/clinics", async (req, res) => {
  const clinic = await prisma.clinic.create({
    data: {
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      whatsapp: req.body.whatsapp,
    },
  });

  res.json(clinic);
});

app.get("/requests", async (req, res) => {
  const requests = await prisma.request.findMany({
    include: {
      clinic: true,
    },
  });

  res.json(requests);
});

app.post("/requests", async (req, res) => {
  const request = await prisma.request.create({
    data: {
      patientName: req.body.patientName,
      procedure: req.body.procedure,
      city: req.body.city || "",
      observation: req.body.observation || "",
      status: "PENDENTE",
      clinicId: req.body.clinicId || null,
    },
  });

  res.json(request);
});

app.put("/requests/:id", async (req, res) => {
  const request = await prisma.request.update({
    where: {
      id: req.params.id,
    },
    data: {
      patientName: req.body.patientName,
      procedure: req.body.procedure,
      city: req.body.city || "",
      observation: req.body.observation || "",
      clinicId: req.body.clinicId || null,
    },
  });

  res.json(request);
});

app.put("/requests/:id/status", async (req, res) => {
  const request = await prisma.request.update({
    where: {
      id: req.params.id,
    },
    data: {
      status: req.body.status,
    },
  });

  res.json(request);
});

app.delete("/requests/:id", async (req, res) => {
  await prisma.request.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({
    message: "Solicitação excluída com sucesso",
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});