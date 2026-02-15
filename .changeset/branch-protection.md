---
"info-web": patch
---

## DevOps: Branch Protection

Настроена защита веток `main` и `development` для предотвращения случайных изменений:

### Защита включена
- ✅ Запрет force push (`allow_force_pushes: false`)
- ✅ Запрет удаления веток (`allow_deletions: false`)
- ✅ Запрет создания веток с этими именами (`block_creations: false`)

### Что это дает
- Защита от случайного `git push --force` в защищенные ветки
- Невозможно удалить ветки `main` и `development`
- История коммитов остается целостной

### Для работы с защищенными ветками
```bash
# Обычный push работает как раньше
git push origin main

# Force push заблокирован (что правильно)
git push --force origin main  # ❌ Будет отклонено

# Используйте feature branches и Pull Requests
git checkout -b feature/my-feature
git push origin feature/my-feature
# Создайте PR в main через GitHub
```

**Примечание**: Эта защита помогает избежать случайных ошибок, но не блокирует обычную работу через PR.
