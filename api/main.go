package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

var (
	Port = 9999
)

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5174")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Header,Authorization,Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /login", handleLogin)
	mux.HandleFunc("POST /logout", handleLogout)
	mux.HandleFunc("GET /me", handleMe)
	mux.HandleFunc("GET /cors", handleMe)
	muxWithCORS := CORSMiddleware(mux)
	http.ListenAndServe(fmt.Sprintf(":%d", Port), muxWithCORS)
}

type LoginReq struct {
	Mail     string `json:"mail"`
	Password string `json:"password"`
}

type LoginRes struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	// ログイン処理
	var req LoginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(req)

	// よしなに認証処理
	if req.Mail != "test@example.com" || req.Password != "password" {
		http.Error(w, fmt.Errorf("error: Invalid email or password").Error(), http.StatusUnauthorized)
		return
	}

	// Cookieを送信
	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = "sample-token"
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.Path = "/"
	cookie.Domain = "localhost"
	cookie.Secure = true
	cookie.HttpOnly = true
	cookie.SameSite = http.SameSiteNoneMode

	http.SetCookie(w, cookie)

	res := LoginRes{
		ID:   1,
		Name: "testman",
	}

	jsonRes, err := json.Marshal(res)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// JSONデータをレスポンスに書き込む
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}

func getCookieValue(r *http.Request, cookieName string) (string, error) {
	cookie, err := r.Cookie(cookieName)
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	// Cookieを送信
	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-100 * time.Hour)
	cookie.Path = "/"
	cookie.Domain = "localhost"
	cookie.Secure = true
	cookie.HttpOnly = true
	cookie.SameSite = http.SameSiteNoneMode

	http.SetCookie(w, cookie)

	// JSONデータをレスポンスに書き込む
	w.WriteHeader(http.StatusOK)
}

func handleMe(w http.ResponseWriter, r *http.Request) {
	token, err := getCookieValue(r, "token")

	if err != nil {
		http.Error(w, fmt.Errorf("error: Invalid token").Error(), http.StatusUnauthorized)
		return
	}

	fmt.Println(token)

	if token != "sample-token" {
		http.Error(w, fmt.Errorf("error: Invalid token").Error(), http.StatusUnauthorized)
		return
	}

	res := LoginRes{
		ID:   1,
		Name: "testman",
	}

	jsonRes, err := json.Marshal(res)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// JSONデータをレスポンスに書き込む
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)
}