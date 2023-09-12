from invoke import Context, task


class Container(str):
    def __new__(cls, value):
        return super().__new__(cls, f"inferred-{value}")


@task
def logs(ctx: Context, container_name: str):
    name = Container(container_name)
    ctx.run(f"docker logs -f {name}", pty=True)


@task
def up(ctx: Context):
    ctx.run("docker compose up -d", pty=True)


@task
def down(ctx: Context, v: bool = False):
    ctx.run(f"docker compose down --remove-orphans {'-v' * v}", pty=True)


@task
def restart(ctx: Context, container_name: str):
    ctx.run(f"docker compose restart {container_name}", pty=True)


@task
def bash(ctx: Context, container_name: str):
    name = Container(container_name)
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
    ctx.run("docker compose run --rm backend bash flush.sh", pty=True)
    ctx.run("inv down")
    ctx.run("inv up")
