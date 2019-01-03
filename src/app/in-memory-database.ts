import { InMemoryDbService } from "angular-in-memory-web-api";

import { Category } from "./pages/categories/shared/category.model";

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: 1, name: "Lazer", description: "Cinema, parques, praia, etc." },
      { id: 2, name: "Saúde", description: "Plano de saúde, remédios." },
      { id: 3, name: "Freelas", description: "Trabalhos como freelancer." },
      { id: 4, name: "Salário", description: "Recebimento de salário." },
      { id: 5, name: "Moradia", description: "Pagamentos de contas de casa." }
    ];
    return { categories };
  }
}
