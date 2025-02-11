from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('hello/', views.HelloView.as_view(), name='Hello'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.LoginView.as_view(), name='Verify Teacher'),
    path('register/', views.CreateUserView.as_view(), name='teacher-register'),
    path('teachers/', views.TeacherListCreateView.as_view(), name='teachers-list-create'),
    path('teachers/<int:pk>/', views.TeacherDetailView.as_view(), name='teacher-detail'),
]