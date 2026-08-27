# Outsera - QA Automation Challenge

Projeto de avaliação técnica para **QA Automação Sênior**, estruturado como entrega de produção: testes independentes, BDD legível, relatórios e execução contínua no GitHub Actions.

## Escopo entregue

| Pilar | Implementação | Cobertura |
| --- | --- | --- |
| API | Playwright API + mock API local em Node | GET, POST, PUT, DELETE, status, headers, body e falhas |
| E2E | Cucumber + Playwright contra Sauce Demo | login, checkout, erro de credencial e entrega incompleta |
| CI/CD | GitHub Actions | execução a cada push/PR e artifact de relatório |
| Carga (extra) | k6 | 500 VUs por 5 minutos, P95 e taxa de erro como thresholds |

> A API sob teste é local e determinística. Isso permite validar, de verdade, payload malformado, campos obrigatórios e método não permitido sem depender de comportamento instável de uma API pública.

## Arquitetura

```text
src/mock-api/                 API de exemplo sob controle do teste
tests/api/                    testes de contrato/comportamento HTTP
features/                     especificações BDD e step definitions E2E
performance/                  cenário de carga em k6
.github/workflows/ci.yml      quality gate no GitHub Actions
reports/                      saída gerada localmente (ignorada no Git)
```

## Pré-requisitos

- Node.js 22+
- npm 10+
- Chromium do Playwright (instalado no primeiro uso)
- k6 (somente para o extra de performance)

## Instalação

```bash
npm ci
npx playwright install chromium
```

## Execução

```bash
# API: inicia a mock API automaticamente
npm run test:api

# E2E BDD
npm run test:e2e

# Suite completa
npm test

# Extra: carga. Atenção: 500 VUs por 5 minutos.
k6 run performance/users-api.js
```

Para acompanhar a interface no E2E localmente:

```bash
HEADLESS=false npm run test:e2e
```

## Relatórios e evidências

- API: `reports/playwright/index.html` (HTML, trace quando houver falha).
- E2E: `reports/cucumber/report.html` e `reports/cucumber/report.json`.
- Falhas E2E: screenshot salvo em `reports/cucumber/`.
- CI: os arquivos de `reports/` são publicados como artifact do GitHub Actions, inclusive em execução com falha.

## Decisões de qualidade

- Não há `waitForTimeout`: as validações usam locators, URL e estados observáveis.
- Os cenários BDD descrevem comportamento, não implementação.
- O fluxo de API valida status, `content-type`, header `Location` e payload.
- Casos negativos cobrem credenciais inválidas, campos obrigatórios, payload inválido, recurso inexistente e método não permitido.
- Retentativa é limitada à CI, para absorver instabilidade transitória sem mascarar flakiness local.

## Versões principais

- Node.js 22
- TypeScript 5
- Playwright 1.55
- Cucumber 11
- k6 (CLI)

## Limites assumidos

O enunciado apresenta mobile como opcional. Não foi incluído um fluxo Appium artificial sem APK, emulador e identificadores nativos reais: seria código de vitrine, não automação confiável. O mesmo raciocínio guiou o teste de carga: o script está pronto, mas a execução contra uma API pública deve ser autorizada antes de gerar 500 usuários virtuais por 5 minutos.
