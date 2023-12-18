from invoke import Context, task


class Container(str):
    def __new__(cls, value):
        assert (
            isinstance(value, str) and value
        ), "Container name must be a non-empty string"
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
def reset(ctx: Context):
    ctx.run("docker compose run --rm backend bash reset.sh", pty=True)
    ctx.run("inv down")
    ctx.run("inv up")


@task
def pylint(ctx: Context, files: str) -> None:
    files = set(files.split())
    backend_files = {f for f in files if f.startswith("backend/")}
    other_files = files - backend_files

    backend_files = " ".join(backend_files)
    other_files = " ".join(other_files)

    if backend_files:
        ctx.run(
            f"pylint -sn -rn --rcfile=./backend/pyproject.toml {backend_files}",
            pty=True,
        )
    if other_files:
        ctx.run(f"pylint -sn -rn {other_files}", pty=True)
