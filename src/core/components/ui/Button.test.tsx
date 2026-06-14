import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

// Consulta por papel/rótulo acessível (regra 30-frontend), não por detalhe de DOM.
describe("Button", () => {
  it("renderiza como botão com o rótulo acessível", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("dispara onClick quando clicado", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enviar</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Adversarial: desabilitado não pode acionar o handler.
  it("não dispara onClick quando disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Bloqueado
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Bloqueado" });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading desabilita o botão (evita duplo submit)", () => {
    render(<Button loading>Carregando</Button>);
    expect(screen.getByRole("button", { name: "Carregando" })).toBeDisabled();
  });
});
