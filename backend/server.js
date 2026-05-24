const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "apoiorede_seguro_2026";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }
}

/* =========================
   HEALTH
========================= */

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "ApoioRede API online",
  });
});

/* =========================
   AUTH
========================= */

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        error: "Usuário já existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao cadastrar usuário",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        error: "Senha inválida",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro no login",
    });
  }
});

/* =========================
   USERS
========================= */

app.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao buscar usuários",
    });
  }
});

/* =========================
   CLINICS
========================= */

app.get("/clinics", authMiddleware, async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(clinics);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao buscar clínicas",
    });
  }
});

app.post("/clinics", authMiddleware, async (req, res) => {
  try {
    const clinic = await prisma.clinic.create({
      data: req.body,
    });

    res.json(clinic);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao criar clínica",
    });
  }
});

/* =========================
   REQUESTS
========================= */

app.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      include: {
        clinic: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(requests);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao buscar solicitações",
    });
  }
});

app.post("/requests", authMiddleware, async (req, res) => {
  try {
    const request = await prisma.request.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });

    await prisma.history.create({
      data: {
        action: "Solicitação criada",
        requestId: request.id,
        userId: req.user.id,
      },
    });

    res.json(request);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao criar solicitação",
    });
  }
});

app.put("/requests/:id", authMiddleware, async (req, res) => {
  try {
    const request = await prisma.request.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    await prisma.history.create({
      data: {
        action: "Solicitação atualizada",
        requestId: request.id,
        userId: req.user.id,
      },
    });

    res.json(request);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao atualizar solicitação",
    });
  }
});

/* =========================
   HISTORY
========================= */

app.get("/history/:requestId", authMiddleware, async (req, res) => {
  try {
    const history = await prisma.history.findMany({
      where: {
        requestId: req.params.requestId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(history);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Erro ao buscar histórico",
    });
  }
});

/* =========================
   START
========================= */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});