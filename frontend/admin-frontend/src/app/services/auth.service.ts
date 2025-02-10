import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/users';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.userId);
                this.getCurrentUser().subscribe();
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error en el login:', error);
                throw error;
            })
        );
    }

    getCurrentUser(): Observable<any> {
        const token = localStorage.getItem('token');
        if (token) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
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

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getUserId(): string | null {
        return localStorage.getItem('userId');
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.currentUserSubject.next(null);
    }

    private loadUserFromStorage(): void {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.getCurrentUser().subscribe();
        }
    }
}