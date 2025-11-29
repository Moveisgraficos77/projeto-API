# GtubeMenssager — protótipo

Projeto de exemplo: mensageiro web (frontend + backend simples com Socket.io) para testes locais.

Rápido para rodar (Windows PowerShell):

```powershell
cd "c:\Users\Mearim\Pictures\Imagens roblox\chaves de apis de IA\projeto API"
npm install
npm run dev
# ou: npm start
```

Abra `http://localhost:3000` no navegador. O backend fornece endpoints simples:

- `GET /api/contacts` — lista de contatos simulados
- `GET /api/messages/:room` — mensagens armazenadas em memória por sala

Observações:

- Dados estão em memória (apenas para teste). Para produção, adicione banco de dados, autenticação e segurança.
- Se você quiser apenas testar frontend com "Live Server" do VS Code, o real-time via Socket.io não funcionará a menos que o servidor Node esteja rodando.
