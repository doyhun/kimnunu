class Debug:
    @classmethod
    def run(cls, app):
        from werkzeug.debug import DebuggedApplication
        app.wsgi_app = DebuggedApplication(app.wsgi_app, True)
        app.debug = True
