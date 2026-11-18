# Gestão Inteligente de Resíduos em Nova Esperança

Protótipo de uma solução para apoiar a gestão da coleta de resíduos por meio de contêineres conectados, sensores IoT, processamento em borda e inteligência artificial.

O projeto propõe transformar leituras de nível e eventos dos contêineres em alertas e prioridades de coleta. A equipe municipal acompanha as informações em um painel e mantém a aprovação humana das rotas sugeridas.

> **Status:** projeto acadêmico em fase de prototipação. Leituras, previsões, indicadores, alertas e rotas apresentados no protótipo são demonstrativos. Não há conexão real com sensores ou serviços externos.

## Problema

A coleta em rotas fixas pode enviar caminhões a contêineres quase vazios e deixar outros transbordarem. Isso pode aumentar deslocamentos, custos operacionais e reclamações. A proposta é usar dados dos contêineres para antecipar necessidades de coleta e apoiar decisões da operação.

## Objetivos

- Monitorar nível, temperatura, inclinação e abertura dos contêineres.
- Identificar leituras atrasadas, ausentes, duplicadas ou fora de faixa.
- Prever o enchimento e sinalizar possíveis anomalias.
- Priorizar contêineres considerando risco de transbordamento e criticidade do local.
- Sugerir rotas para análise e aprovação de um supervisor.
- Apresentar informações de forma clara para gestores e equipes de coleta.

## Arquitetura proposta

```text
Sensores nos contêineres
          ↓
Rede LPWAN (LoRaWAN; NB-IoT como alternativa)
          ↓
Gateway e processamento de borda
          ↓
Broker MQTT e ingestão de dados
          ↓
Validação, padronização e armazenamento de séries temporais
          ↓
Previsão de enchimento e detecção de anomalias
          ↓
Painel de gestão, alertas e rotas sugeridas
          ↓
Revisão e aprovação humana
```

Na proposta, a borda pode sincronizar horários, converter unidades, remover duplicidades, emitir alertas imediatos e armazenar dados temporariamente durante uma interrupção de conexão. A nuvem concentra o histórico, o treinamento dos modelos e o planejamento da frota.

## Funcionalidades previstas no protótipo

- **Visão geral:** indicadores operacionais, contêineres prioritários, alertas e rotas.
- **Mapa de contêineres:** localização e detalhes das leituras e dos dispositivos.
- **Rotas de coleta:** paradas sugeridas, veículo, andamento e aprovação simulada.
- **Alertas e anomalias:** risco de transbordamento, temperatura incomum, inclinação e falha de sensor.
- **Histórico e relatórios:** consulta demonstrativa de eventos e métricas.
- **Dispositivos e sensores:** conectividade, bateria, firmware e última comunicação.

## Dados considerados

Cada contêiner pode ter identificador, localização, capacidade, tipo de resíduo e informações de instalação. As leituras previstas incluem:

- Nível, coletado periodicamente.
- Temperatura, inclinação e abertura, coletadas por evento ou em verificações periódicas.
- Horário da leitura, unidade, bateria e versão do firmware.

## Inteligência artificial e avaliação

A proposta considera uma linha de base baseada na taxa média de enchimento por contêiner e dia da semana, comparada a modelos como Random Forest, Gradient Boosting e modelos de séries temporais. Para anomalias, combina regras físicas com métodos como Isolation Forest.

A avaliação planejada usa divisão cronológica entre treino, validação e teste. Para previsão, considera MAE e RMSE; para detecção, precisão, revocação e F1, além de falsos alarmes e antecedência dos alertas. Esses métodos fazem parte da proposta e não devem ser interpretados como resultados já validados em operação.

## Tecnologias consideradas

As tecnologias abaixo descrevem a arquitetura planejada; não significam que já estejam implementadas ou integradas no protótipo:

- Sensores IoT de nível, temperatura, inclinação e abertura.
- LoRaWAN/LPWAN e, como alternativa em áreas sem cobertura, NB-IoT.
- Gateway com processamento em borda.
- MQTT para mensageria.
- Armazenamento de séries temporais e dados históricos.
- Modelos de previsão, detecção de anomalias e otimização de rotas (VRP/OR-Tools).
- Interface web para gestão e acompanhamento da coleta.

## Como visualizar

O protótipo visual deve ser gerado ou executado no Google AI Studio conforme a implementação associada a este repositório. Esta versão do repositório não contém instruções de instalação de dependências ou execução local; elas devem ser adicionadas quando o código-fonte da aplicação for incluído.

Ao demonstrar a interface, utilize dados simulados e mantenha visível que mapas, leituras, métricas, previsões e ações não representam uma operação real.

## Segurança e operação

A arquitetura proposta considera autenticação por dispositivo, criptografia, controle de acesso por perfil, firmware assinado, logs, monitoramento de bateria e conectividade, acompanhamento de drift e retreinamento dos modelos. Esses são requisitos de projeto, não uma declaração de que tais controles já estejam implementados.

## Limitações e próximos passos

- O protótipo não está conectado a contêineres, gateways ou serviços externos.
- As previsões e os indicadores precisam ser validados com dados reais antes de qualquer uso operacional.
- A qualidade do sistema depende da cobertura de comunicação, da manutenção dos sensores e do histórico disponível.
- Próximas etapas incluem implementar a interface, definir o formato das mensagens, construir o dicionário de dados e testar os modelos com dados representativos.

## Referências

- CHANDOLA, V.; BANERJEE, A.; KUMAR, V. *Anomaly detection: a survey*. ACM Computing Surveys, v. 41, n. 3, 2009.
- GÉRON, A. *Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow*. 3. ed. O'Reilly Media, 2022.
- HYNDMAN, R. J.; ATHANASOPOULOS, G. *Forecasting: Principles and Practice*. 3. ed. OTexts, 2021.
- LEE, J.; BAGHERI, B.; KAO, H.-A. A Cyber-Physical Systems Architecture for Industry 4.0-Based Manufacturing Systems. *Manufacturing Letters*, v. 3, 2015.
- LIU, F. T.; TING, K. M.; ZHOU, Z.-H. Isolation Forest. In: *IEEE International Conference on Data Mining*, 2008.
- SHI, W. et al. Edge Computing: Vision and Challenges. *IEEE Internet of Things Journal*, v. 3, n. 5, 2016.

---

Projeto acadêmico sobre gestão inteligente de resíduos, IoT, computação em borda e inteligência artificial.
