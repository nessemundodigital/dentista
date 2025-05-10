# Denti Form Easy

Aplicativo simples para gerenciar pacientes de uma clínica odontológica. Permite que pacientes agendem consultas preenchendo um formulário, e que a clínica visualize e gerencie esses dados.

## Funcionalidades

- Formulário para agendamento de consultas.
- Painel administrativo para visualizar e gerenciar pacientes.
- Compartilhamento do link do formulário via WhatsApp, Instagram ou anúncios online.
- Configuração de nome e logo da clínica.
- Arquivamento de pacientes antigos para controle de armazenamento.
- Responsivo para desktop e mobile.

## Tecnologias

- React com TypeScript
- Vite
- Tailwind CSS
- Supabase (backend e banco de dados)
- Radix UI
- Sonner (notificações)
- Lucide Icons

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento.
- `npm run build` - Gera a build para produção na pasta `dist`.
- `npm run preview` - Visualiza a build de produção localmente.

## Deploy na Netlify

O projeto já possui configuração para deploy na Netlify via arquivo `netlify.toml`.

- Build command: `npm run build`
- Publish directory: `dist`

Para fazer o deploy:

1. Faça login na Netlify e conecte seu repositório Git (GitHub, GitLab, etc).
2. Configure o build command e o diretório de publicação conforme acima.
3. Faça o deploy e acesse o site pelo domínio fornecido.

## Configurações

- Personalize o nome e logo da clínica no painel administrativo.
- O link do formulário pode ser compartilhado com os pacientes para agendamento.

## Observações

- O botão "Compartilhar" está disponível tanto na versão desktop quanto na versão mobile no painel administrativo.
- Para problemas de armazenamento, utilize a função de arquivamento de pacientes antigos.

## Contato

Para dúvidas ou suporte, entre em contato com o desenvolvedor.

---
