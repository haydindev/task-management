
const test = require("node:test");
const assert = require("node:assert/strict");

const API_URL = "http://localhost:3000";

// Test 1: Health endpoint
test("GET /health başarılı olmalı", async () => {
  const response = await fetch(`${API_URL}/health`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, "ok");
});

// Test 2: Geçersiz görev engellenmeli
test("POST geçersiz başlığa 400 dönmeli", async () => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: "   " }),
  });

  assert.equal(response.status, 400);
});

// Test 3: Tam CRUD döngüsü
test("Görev oluşturulmalı, okunmalı, güncellenmeli ve silinmeli", async () => {
  let taskId;

  try {
    // CREATE
    const createResponse = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "Otomatik API testi" }),
    });

    assert.equal(createResponse.status, 201);

    const createdTask = await createResponse.json();
    taskId = createdTask.id;

    assert.equal(createdTask.title, "Otomatik API testi");

    // READ
    const getResponse = await fetch(`${API_URL}/api/tasks`);

    assert.equal(getResponse.status, 200);

    const tasks = await getResponse.json();

    assert.ok(tasks.some((task) => task.id === taskId));

    // UPDATE
    const updateResponse = await fetch(
      `${API_URL}/api/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      }
    );

    assert.equal(updateResponse.status, 200);

    const updatedTask = await updateResponse.json();

    assert.equal(updatedTask.completed, true);

    // DELETE
    const deleteResponse = await fetch(
      `${API_URL}/api/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    assert.equal(deleteResponse.status, 204);
    taskId = undefined;

    // Silinen görev artık listede olmamalı
    const finalResponse = await fetch(`${API_URL}/api/tasks`);
    const remainingTasks = await finalResponse.json();

    assert.ok(
      !remainingTasks.some((task) => task.id === createdTask.id)
    );
  } finally {
    // Test hata verirse oluşturduğumuz görevi temizle
    if (taskId) {
      await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
      });
    }
  }
});
