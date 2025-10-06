import { createRouter, createWebHistory } from "vue-router";
import Inicio from "@/pages/Inicio.vue";
import DefaultLayout from "@/layouts/default.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "Inicio",
        component: Inicio,
      },
      {
        path: "productos",
        name: "Productos",
        component: () => import("@/pages/Productos.vue"),
      },
      {
        path: "categorias",
        name: "Categorias",
        component: () => import("@/pages/Categorias.vue"),
      },
      {
        path: "clientes",
        name: "Clientes",
        component: () => import("@/pages/Clientes.vue"),
      },
      {
        path: "proveedores",
        name: "Proveedores",
        component: () => import("@/pages/Proveedores.vue"),
      },
      {
        path: "pedidos",
        name: "Pedidos",
        component: () => import("@/pages/Pedidos.vue"),
      },
      {
        path: "ventas",
        name: "Ventas",
        component: () => import("@/pages/Ventas.vue"),
      },
      {
        path: "inventario",
        name: "Inventario",
        component: () => import("@/pages/Inventario.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
