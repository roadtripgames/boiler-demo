import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const billingRouter = createTRPCRouter({
  products: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: { active: true },
      include: { prices: true },
    });

    return products;
  }),
});

export default billingRouter;
