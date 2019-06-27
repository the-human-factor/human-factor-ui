from importlib import import_module

def module_classes_as_dict(module_name):
    module = import_module(module_name)
    return dict([(name, klass) for name, klass in module.__dict__.items() if isinstance(klass, type)])
