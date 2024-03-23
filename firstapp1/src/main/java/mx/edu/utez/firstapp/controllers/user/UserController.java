package mx.edu.utez.firstapp.controllers.user;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.firstapp.config.ApiResponse;
import mx.edu.utez.firstapp.models.user.User;
import mx.edu.utez.firstapp.services.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAll() {
        return service.findAll();
    }

    //Update
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable("id") Long id) {
        return service.findById(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> changeStatus(@PathVariable("id") Long id) {
        return service.changeStatus(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        return service.updateUser(id, user);
    }
}

