from invoke import Context, task

CONTAINER_SHORT_NAMES = {
    "backend": "inferred-backend",
    "frontend": "inferred-frontend",
    "mock": "inferred-mock",
    "capture": "inferred-capture",
    "worker": "inferred-worker",
}


@task
def logs(ctx: Context, container_name: str):
    name = CONTAINER_SHORT_NAMES.get(container_name, container_name)
    ctx.run(f"docker logs -f {name}", pty=True)


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
def migrate(ctx: Context, make: bool = False, rm: bool = False):
    if rm:
        cmd = 'find . -path "*/migrations/*.py" -not -name "__init__.py" -delete'
        ctx.run(cmd, pty=True)
        make = True

    if make:
        cmd = "docker exec -it inferred-backend python3 manage.py makemigrations"
        ctx.run(cmd, pty=True)

    ctx.run("docker exec -it inferred-backend python3 manage.py migrate", pty=True)


@task
def build(ctx: Context):
    ctx.run("docker compose up -d --build --remove-orphans", pty=True)


@task
def flush(ctx: Context):
    ctx.run("docker exec -it inferred-backend bash flush.sh", pty=True)
