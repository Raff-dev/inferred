from invoke import Context, task

CONTAINER_SHORT_NAMES = {
    "back": "inferred-backend",
    "front": "inferred-frontend",
    "mock": "inferred-mock",
}


@task
def logs(ctx: Context, container_name: str):
    name = CONTAINER_SHORT_NAMES.get(container_name, container_name)
    ctx.run(f"docker compose logs -f {name}", pty=True)


@task
def up(ctx: Context):
    ctx.run("docker compose up -d", pty=True)


@task
def down(ctx: Context):
    ctx.run("docker compose down --remove-orphans", pty=True)


@task
def restart(ctx: Context, container_name: str):
    ctx.run(f"docker compose restart {container_name or ''}", pty=True)


@task
def bash(ctx: Context, container_name: str):
    name = CONTAINER_SHORT_NAMES.get(container_name)
    print(name)
    ctx.run(f"docker exec -it {name} bash", pty=True)


@task
def build(ctx: Context):
    ctx.run("docker compose up -d --build --remove-orphans", pty=True)
