package mx.edu.utez.firstapp.services.user;

import mx.edu.utez.firstapp.config.ApiResponse;
import mx.edu.utez.firstapp.models.person.Person;
import mx.edu.utez.firstapp.models.user.User;
import mx.edu.utez.firstapp.models.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Optional<User> findUserByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAll() {
        return new ResponseEntity<>(new ApiResponse(
                repository.findAll(), HttpStatus.OK
        ), HttpStatus.OK);
    }


    /*
    * @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> update(User user){
        try{

        }catch (Exception e){

        }
    }*/

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> changeStatus(Long id) {
        Optional<User> foundUser = repository.findById(id);

        if (foundUser.isEmpty())
            return new ResponseEntity<>(new ApiResponse(
                    HttpStatus.BAD_REQUEST, true, "UserNotFound"
            ), HttpStatus.BAD_REQUEST);
        User user = foundUser.get();
        user.setStatus(!user.getStatus());
        return new ResponseEntity<>(new ApiResponse(
                repository.save(user),
                HttpStatus.OK
        ), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Optional<User> foundUser = repository.findById(id);
        if (foundUser.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(
                    HttpStatus.BAD_REQUEST, true, "UserNotFound"
            ), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new ApiResponse(
                foundUser.get(), HttpStatus.OK
        ), HttpStatus.OK);
    }


    //UPDATE
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> updateUser(Long id, User updatedUser) {
        Optional<User> foundUser = repository.findById(id);

        if (foundUser.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(
                    HttpStatus.BAD_REQUEST, true, "UserNotFound"
            ), HttpStatus.BAD_REQUEST);
        }

        User user = foundUser.get();
        user.setUsername(updatedUser.getUsername());
        user.setAvatar(updatedUser.getAvatar());

        // Actualizar roles
        user.setRoles(updatedUser.getRoles());

        // Actualizar datos de la persona
        Person person = user.getPerson();
        if (person != null && updatedUser.getPerson() != null) {
            person.setName(updatedUser.getPerson().getName());
            person.setSurname(updatedUser.getPerson().getSurname());
            person.setLastname(updatedUser.getPerson().getLastname());
            person.setBirthDate(updatedUser.getPerson().getBirthDate());
            person.setCurp(updatedUser.getPerson().getCurp());
            // Actualizar otras propiedades de la persona...
        } else {
            // Manejar el caso en que la persona no esté asociada al usuario o los datos actualizados de la persona sean nulos
        }

        user.setPerson(person);

        return new ResponseEntity<>(new ApiResponse(
                repository.save(user),
                HttpStatus.OK
        ), HttpStatus.OK);
    }

}