# Backend
- categories(id, name, user_id, created_at, updated_at)
- tasks(id, name, user_id, category_id, created_at, updated_at)
- users(id, name, email, password, created_at, updated_at)
- users_tasks(id, user_id, task_id, created_at, updated_at)

- Créer des catégories et des tâches par défaut dans un fichier et seeder les nouveaux utilisateurs

# Frontend
- Proposer les tâches par défaut, puis ensuite proposer les tâches les plus utilisées
- Afficher de temps en temps des messages du type "Wouhou, tu as validé XX fois cette tâche ! Félicitations"