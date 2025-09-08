from django.http import HttpResponse,JsonResponse

def say_hi(request):
    """
    A simple view that responds with "Hi" to a GET request.
    """
    # This view only needs to handle GET requests, which is the default.
    return JsonResponse({"data":"Hello"})