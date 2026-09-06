from django.contrib.auth import get_user_model, login, logout
from django.middleware.csrf import get_token
from django.urls import reverse
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (ForgotPasswordSerializer, LoginSerializer,
                          RegisterSerializer, UserSerializer)
from .tasks import send_password_reset_email

User = get_user_model()


class ApiRootView(APIView):
    def get(self, request):
        return Response(
            {
                "register": request.build_absolute_uri(reverse("register")),
                "login": request.build_absolute_uri(reverse("login")),
                "logout": request.build_absolute_uri(reverse("logout")),
                "me": request.build_absolute_uri(reverse("me")),
                "csrf": request.build_absolute_uri(reverse("csrf")),
                "forgot-password": request.build_absolute_uri(reverse("forgot-password")),
            }
        )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        login(request, user)

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        login(request, user)

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)

        return Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CsrfView(APIView):
    def get(self, request):
        return Response({"csrfToken": get_token(request)})


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        user = User.objects.filter(email__iexact=email).first()

        if user:
            send_password_reset_email.delay(user.pk)

        return Response(
            {
                "detail": (
                    "If an account exists with that email address, " "you will receive a password reset link shortly."
                )
            },
            status=status.HTTP_200_OK,
        )
