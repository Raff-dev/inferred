from invoke import Context, task

CONTAINER_SHORT_NAMES = {
    "back": "inferred-backend",
    "front": "inferred-frontend",
    "mock": "inferred-mock",
}


@task
def logs(ctx: Context, container_name: str):
    name = CONTAINER_SHORT_NAMES.get(container_name, container_name)
    ctx.run(f"docker compose logs -f {name}")


@task
def up(ctx: Context):
    ctx.run("docker compose up -d")


@task
def down(ctx: Context):
    ctx.run("docker compose down --remove-orphans")


@task
def restart(ctx: Context, container_name: str = None):
    name = CONTAINER_SHORT_NAMES.get(container_name)
    ctx.run(f"docker compose restart {name or ''}")


@task
def bash(ctx: Context, container_name: str):
    name = CONTAINER_SHORT_NAMES.get(container_name)
    print(name)
    ctx.run(f"docker compose exec -it {name} bash")
