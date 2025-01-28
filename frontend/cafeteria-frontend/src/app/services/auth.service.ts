import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; // Importa HttpHeaders
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'; // Importa catchError

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/users';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Método para registrar un nuevo usuario
    register(user: { name: string, email: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    // Método para iniciar sesión
    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                localStorage.setItem('token', response.token);
                this.getCurrentUser().subscribe();
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error en el login:', error);
                throw error; // Puedes manejar el error de manera más específica aquí
            })
        );
    }

    getCurrentUser(): Observable<any> {
        const token = localStorage.getItem('token');
        if (token) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}` // Incluye el token en la cabecera
            });
    
            return this.http.get(`${this.apiUrl}/me`, { headers }).pipe(
                tap((user: any) => {
                    this.currentUserSubject.next(user);
                }),
                catchError((error: HttpErrorResponse) => {
                    console.error('Error al obtener el usuario actual:', error);
                    this.currentUserSubject.next(null);
                    throw error;
                })
            );
        } else {
            this.currentUserSubject.next(null);
            return new Observable((observer) => observer.next(null));
        }
    }

    // Método para verificar si el usuario está autenticado
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    // Método para cerrar sesión
    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }
}
