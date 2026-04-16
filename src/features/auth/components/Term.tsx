import { Box, Typography } from "@/core/components/ui";

export default function Term() {
  return (
    <Box className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
      <div className="space-y-2 border-b border-border pb-5">
        <Typography as="h1" variant="h2" className="text-foreground">
          TERMOS DE USO – SISTEMA IVCF
        </Typography>
        <Typography variant="small" className="max-w-3xl leading-6">
          Bem-vindo ao sistema IVCF. Ao acessar e utilizar esta aplicação, você
          concorda com os presentes Termos de Uso. Caso não concorde,
          recomendamos que não utilize o sistema.
        </Typography>
      </div>

      <div className="space-y-5 text-sm leading-7 text-muted-foreground">
        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            1. Sobre o Sistema
          </Typography>
          <Typography>
            O sistema IVCF é uma plataforma digital desenvolvida pelo
            <strong> LIFE Systems (UFPR)</strong>,
            <a
              href="https://www.lifesysems.ufpr.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              www.lifesysems.ufpr.br
            </a>
            , com o objetivo de:
          </Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              auxiliar na aplicação do Índice de Vulnerabilidade
              Clínico-Funcional (IVCF)
            </li>
            <li>registrar e armazenar dados de avaliações</li>
            <li>
              apoiar profissionais de saúde na análise funcional de pacientes
            </li>
          </ul>
          <Typography>
            O sistema pode ser utilizado para fins{" "}
            <strong>clínicos, acadêmicos e de pesquisa</strong>.
          </Typography>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            2. Responsabilidade do Usuário
          </Typography>
          <Typography>O usuário declara que:</Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              utilizará o sistema apenas para fins{" "}
              <strong>lícitos e éticos</strong>
            </li>
            <li>
              é responsável pela <strong>veracidade dos dados inseridos</strong>
            </li>
            <li>
              possui autorização para registrar dados de pacientes, quando
              aplicável
            </li>
            <li>manterá suas credenciais de acesso seguras</li>
          </ul>
          <Typography>É proibido:</Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>inserir dados falsos ou fraudulentos</li>
            <li>utilizar o sistema para fins ilegais</li>
            <li>tentar acessar dados de outros usuários sem autorização</li>
          </ul>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            3. Limitações do Sistema
          </Typography>
          <Typography>O sistema IVCF:</Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>não substitui avaliação clínica profissional</strong>
            </li>
            <li>
              é uma ferramenta de <strong>apoio à decisão</strong>
            </li>
            <li>
              depende da correta inserção de dados para gerar resultados
              confiáveis
            </li>
          </ul>
          <Typography>
            Os resultados apresentados devem ser interpretados por{" "}
            <strong>profissionais qualificados.</strong>
          </Typography>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            4. Tratamento de Dados
          </Typography>
          <Typography>O sistema pode armazenar informações como:</Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>dados demográficos (ex: idade, sexo)</li>
            <li>respostas de questionários</li>
            <li>resultados de avaliações</li>
          </ul>
          <Typography>O tratamento dos dados segue princípios de:</Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>confidencialidade</li>
            <li>integridade</li>
            <li>segurança</li>
          </ul>
          <Typography>Os dados podem ser utilizados para:</Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>análise clínica</li>
            <li>pesquisas acadêmicas</li>
            <li>melhoria do sistema</li>
          </ul>
          <Typography>
            Sempre que aplicável, devem ser respeitadas as diretrizes da{" "}
            <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
          </Typography>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            5. Privacidade e Segurança
          </Typography>
          <Typography>
            São adotadas medidas técnicas para proteger os dados, incluindo:
          </Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>controle de acesso</li>
            <li>armazenamento seguro</li>
            <li>comunicação protegida</li>
          </ul>
          <Typography>
            No entanto, nenhum sistema é totalmente imune a riscos, e o usuário
            reconhece essa limitação.
          </Typography>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            6. Uso para Pesquisa
          </Typography>
          <Typography>
            Os dados coletados poderão ser utilizados em estudos científicos,
            incluindo:
          </Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>análises estatísticas</li>
            <li>publicações acadêmicas</li>
            <li>desenvolvimento de modelos computacionais</li>
          </ul>
          <Typography>
            Sempre que possível, os dados serão utilizados de forma anonimizada.
          </Typography>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            7. Disponibilidade do Sistema
          </Typography>
          <Typography>O sistema pode:</Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>sofrer interrupções temporárias</li>
            <li>passar por atualizações e melhorias</li>
            <li>ter funcionalidades modificadas sem aviso prévio</li>
          </ul>
          <Typography>Não há garantia de disponibilidade contínua.</Typography>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            8. Isenção de Responsabilidade
          </Typography>
          <Typography>
            Os desenvolvedores e mantenedores do sistema não se responsabilizam
            por:
          </Typography>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              decisões clínicas baseadas exclusivamente nos resultados do
              sistema
            </li>
            <li>uso inadequado da ferramenta</li>
            <li>inserção incorreta de dados pelo usuário</li>
          </ul>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            9. Alterações nos Termos
          </Typography>
          <Typography>
            Estes Termos de Uso podem ser atualizados a qualquer momento.
            Recomenda-se a revisão periódica.
          </Typography>
        </section>

        <section className="space-y-2">
          <Typography as="h2" variant="h4" className="text-foreground">
            10. Contato
          </Typography>
          <Typography>
            Para dúvidas, sugestões ou suporte, entre em contato com a equipe
            responsável pelo sistema.
          </Typography>
          <Typography className="font-medium text-foreground">
            <a href="mailto:lifesystems@ufpr.br" className="hover:underline">
              lifesystems@ufpr.br
            </a>
          </Typography>
        </section>

        <section className="space-y-2 border-t border-border pt-4">
          <Typography as="h2" variant="h4" className="text-foreground">
            11. Aceite
          </Typography>
          <Typography>
            Ao utilizar o sistema, o usuário declara estar ciente e de acordo
            com estes Termos de Uso.
          </Typography>
        </section>
      </div>
    </Box>
  );
}
