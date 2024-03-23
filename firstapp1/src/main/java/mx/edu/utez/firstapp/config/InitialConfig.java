package mx.edu.utez.firstapp.config;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.firstapp.models.person.Person;
import mx.edu.utez.firstapp.models.person.PersonRepository;
import mx.edu.utez.firstapp.models.role.Role;
import mx.edu.utez.firstapp.models.role.RoleRepository;
import mx.edu.utez.firstapp.models.user.User;
import mx.edu.utez.firstapp.models.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class InitialConfig implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;


    @Override
    @Transactional(rollbackFor = {SQLException.class})
    public void run(String... args) throws Exception {

        Role adminRole = getOrSaveRole(new Role("ADMIN_ROLE"));
        getOrSaveRole(new Role("USER_ROLE"));
        getOrSaveRole(new Role("CLIENT_ROLE"));
        //Crear un usuario para que puedan iniciar sesión (person, user, user_role)
        Person person = getOrSavePerson(
                new Person("mike", "moreno", null,
                        LocalDate.of(1998, 1, 19), "MOVM980119HM")
        );
        User user = getOrSaveUser(
                new User("admin", encoder.encode("admin"), person)
        );
        saveUserRoles(user.getId(), adminRole.getId());

        // Crear usuario con rol de usuario
        Person userPerson = getOrSavePerson(
                new Person("Luis Angel", "Meza", "Adan",
                        LocalDate.of(2000, 11, 8), "MEAL001108DLAHMSA3")
        );
        User normalUser = getOrSaveUser(
                new User("user", encoder.encode("user"), userPerson)
        );
        Role userRole = getOrSaveRole(new Role("USER_ROLE"));
        saveUserRoles(normalUser.getId(), userRole.getId());



        // Crear usuario cliente
        Person clientPerson = getOrSavePerson(
                new Person("Felipe", "Diaz", null,
                        LocalDate.of(1995, 2, 2), "GHOPAD3828INBE0")
        );
        User clientUser = getOrSaveUser(
                new User("client", encoder.encode("client"), clientPerson)
        );
        Role clientRole = getOrSaveRole(new Role("CLIENT_ROLE"));
        saveUserRoles(clientUser.getId(), clientRole.getId());
    }

    @Transactional
    public Role getOrSaveRole(Role role) {
        Optional<Role> foundRole = roleRepository.findByName(role.getName());
        return foundRole.orElseGet(() -> roleRepository.saveAndFlush(role));
    }
    @Transactional
    public Person getOrSavePerson(Person person) {
        Optional<Person> foundPerson = personRepository.findByCurp(person.getCurp());
        return foundPerson.orElseGet(() -> personRepository.saveAndFlush(person));
    }
    @Transactional
    public User getOrSaveUser(User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());
        return foundUser.orElseGet(() -> userRepository.saveAndFlush(user));
    }
    @Transactional
    public void saveUserRoles(Long id, Long roleId) {
        Long userRoleId = userRepository.getIdUserRoles(id, roleId);
        if (userRoleId == null)
            userRepository.saveUserRole(id, roleId);
    }

}


