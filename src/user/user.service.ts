import {
  ConflictException,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { User } from 'src/entities/user.entity';
import { UserType } from 'src/entities/user.type';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepo: Repository<UserType>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUserType() {
    let userTypes = await this.userTypeRepo.find();
    if (!userTypes.length) {
      userTypes = this.userTypeRepo.create([
        {
          name: 'Scrum Master',
        },
        {
          name: 'Developer',
        },
      ]);
    }
    return this.userTypeRepo.save(userTypes);
    // this.userType.find();
  }

  async findOne(query) {
    return this.userRepo.findOne(query, {
      relations: ['tickets', 'userType'],
    });
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    const obj = {
      relations: ['tickets', 'userType'],
      skip: offset,
      take: limit,
      where: { userType: 2 },
    };

    return this.userRepo.find(obj);
  }

  async createUser(createUser) {
    const { type, ...obj } = createUser;
    const userType = await this.userTypeRepo.findOne({
      id: type,
    });
    console.log(obj);
    if (!userType) {
      throw new NotFoundException('Invalid User Type');
    }

    const duplicateUser = await this.userRepo.findOne({ name: obj.name });
    console.log({ name: obj.name });
    console.log(duplicateUser);

    if (duplicateUser) {
      throw new ConflictException('User already Taken');
    }

    const user = this.userRepo.create({
      ...obj,
      userType,
    });
    return this.userRepo.save(user);
  }
}
