import { useState } from "react";
import { useTeam } from "@/lib/useTeam";
import { api } from "@/utils/api";
import { Button } from "@/components/design-system/Button";
import { Input } from "@/components/design-system/Input";

function CreateInput() {
  const { data: team } = useTeam();
  const utils = api.useContext();
  const createTodoMutation = api.todos.create.useMutation({
    onSuccess() {
      utils.invalidate(undefined, {
        queryKey: api.todos.get.getQueryKey({ teamId: team?.id }),
      });
    },
  });
  const [newTodo, setNewTodo] = useState("");

  return (
    <form
      className="flex items-center justify-between space-x-2"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!newTodo || !team) {
          return;
        }

        await createTodoMutation.mutateAsync({
          text: newTodo,
          teamId: team.id,
        });

        setNewTodo("");
      }}
    >
      <Input
        value={newTodo}
        autoFocus
        placeholder="Add todo..."
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <Button loading={createTodoMutation.isLoading} type="submit">
        Create
      </Button>
    </form>
  );
}

export default function Todos() {
  const { data: team } = useTeam();
  const { data: todos = [] } = api.todos.get.useQuery(
    { teamId: team?.id },
    { enabled: !!team }
  );

  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-xl font-medium">Todos</h1>
      <div className="flex flex-col space-y-4">
        <CreateInput />
        <div className="rounded-md border border-slate-300 bg-slate-50 p-5">
          {todos?.length === 0 && (
            <span className="text-center text-slate-500">No tasks left</span>
          )}
          {todos?.length > 0 && (
            <div className="flex flex-col space-y-2">
              {todos.map((t) => {
                return (
                  <div
                    key={t.id}
                    className="rounded-md border bg-white px-3 py-2"
                  >
                    {t.text}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
