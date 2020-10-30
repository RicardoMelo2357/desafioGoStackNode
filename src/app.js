const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newId = uuid();
  repositories.push({ id: newId, url: url, title: title, techs: techs, likes: 0 });
  const recentlyAdded = repositories.find(repo => repo.id == newId);
  return response.json(recentlyAdded);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const resultIndex = repositories.findIndex(repo => repo.id == id);
  if (resultIndex < 0) response.status(400).json({ error: 'repositorio não encontrado!' });
  repositories[resultIndex] = { id, title, url, techs, likes: repositories[resultIndex].likes };

  return response.json(repositories[resultIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const resultIndex = repositories.findIndex(repo => repo.id == id);
  if (resultIndex < 0) {
    return response.status(400).json({ error: 'repositorio não encontrado!' });
  }
  repositories.splice(resultIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id == id);
  if (repoIndex < 0) return response.status(400).send();

  repositories[repoIndex].likes += 1;

  return response.status(200).json({ likes: repositories[repoIndex].likes });
});

module.exports = app;